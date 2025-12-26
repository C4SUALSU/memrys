-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTNERSHIPS
CREATE TABLE partnerships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    user_2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_partnership UNIQUE(user_1_id, user_2_id)
);

-- POSTS
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('photo', 'video')) NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deletion_requested_at TIMESTAMPTZ,
    deletion_status TEXT CHECK (deletion_status IN ('none', 'pending', 'rejected')) DEFAULT 'none',
    read_only BOOLEAN DEFAULT FALSE
);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CALENDAR EVENTS
CREATE TABLE calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DAILY MEMORIES
CREATE TABLE daily_memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    partnership_id UUID REFERENCES partnerships(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    ai_message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_memories ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can view all profiles (needed for search/invite) but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Partnerships: Users can only see partnerships they are part of
CREATE POLICY "Users can view their own partnerships" ON partnerships FOR SELECT 
USING (auth.uid() = user_1_id OR auth.uid() = user_2_id);

CREATE POLICY "Users can create partnerships" ON partnerships FOR INSERT
WITH CHECK (auth.uid() = user_1_id OR auth.uid() = user_2_id);

-- Posts: Access restricted to partnership members
CREATE POLICY "Partnership members can view posts" ON posts FOR SELECT
USING (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = posts.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

CREATE POLICY "Partnership members can insert posts" ON posts FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = posts.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

CREATE POLICY "Partnership members can update posts" ON posts FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = posts.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

-- Chat Messages
CREATE POLICY "Partnership members can view chat" ON chat_messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = chat_messages.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

CREATE POLICY "Partnership members can send chat" ON chat_messages FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = chat_messages.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

-- Calendar Events
CREATE POLICY "Partnership members can view calendar" ON calendar_events FOR SELECT
USING (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = calendar_events.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

CREATE POLICY "Partnership members can manage calendar" ON calendar_events FOR ALL
USING (EXISTS (
    SELECT 1 FROM partnerships 
    WHERE id = calendar_events.partnership_id AND (user_1_id = auth.uid() OR user_2_id = auth.uid())
));

-- FUNCTIONS & TRIGGERS

-- Deletion State Machine Function
CREATE OR REPLACE FUNCTION handle_post_deletion_state()
RETURNS TRIGGER AS $$
BEGIN
    -- If deletion is requested, set read_only to true for 24 hours
    IF NEW.deletion_requested_at IS NOT NULL AND OLD.deletion_requested_at IS NULL THEN
        NEW.read_only := TRUE;
        NEW.deletion_status := 'pending';
    END IF;

    -- If deletion is rejected, start 12h cool down (still read-only but status changes)
    -- This logic will be handled by the app or a cron job to revert read_only
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_deletion_request
    BEFORE UPDATE ON posts
    FOR EACH ROW
    WHEN (NEW.deletion_requested_at IS NOT NULL AND OLD.deletion_requested_at IS NULL)
    EXECUTE FUNCTION handle_post_deletion_state();
