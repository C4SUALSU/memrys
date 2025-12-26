export type Profile = {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
};

export type PartnershipStatus = 'pending' | 'active' | 'rejected';

export type Partnership = {
    id: string;
    user_1_id: string;
    user_2_id: string;
    status: PartnershipStatus;
    created_at: string;
};

export type PostType = 'photo' | 'video';
export type DeletionStatus = 'none' | 'pending' | 'rejected';

export type Post = {
    id: string;
    partnership_id: string;
    author_id: string;
    type: PostType;
    media_url: string;
    caption: string | null;
    created_at: string;
    deletion_requested_at: string | null;
    deletion_status: DeletionStatus;
    read_only: boolean;
};

export type ChatMessage = {
    id: string;
    partnership_id: string;
    sender_id: string;
    content: string;
    created_at: string;
};

export type CalendarEvent = {
    id: string;
    partnership_id: string;
    author_id: string;
    title: string;
    description: string | null;
    event_date: string;
    created_at: string;
};

export type DailyMemory = {
    id: string;
    partnership_id: string;
    post_id: string;
    ai_message: string;
    created_at: string;
};
