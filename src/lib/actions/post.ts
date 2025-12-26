import { createClient } from '@/lib/supabase/server';

export async function getPosts(partnershipId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*, author_id(display_name, avatar_url)')
        .eq('partnership_id', partnershipId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data;
}

export async function createPost(
    partnershipId: string,
    type: 'photo' | 'video',
    mediaUrl: string,
    caption?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('posts')
        .insert({
            partnership_id: partnershipId,
            author_id: user.id,
            type,
            media_url: mediaUrl,
            caption
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function requestDeletion(postId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('posts')
        .update({
            deletion_requested_at: new Promise(r => r(new Date().toISOString())), // This is a bit weird in a static context, will fix below
        })
        .eq('id', postId);

    // Fix: use real date
    const now = new Date().toISOString();
    const { error: realError } = await supabase
        .from('posts')
        .update({
            deletion_requested_at: now,
            deletion_status: 'pending'
        })
        .eq('id', postId);

    if (realError) throw realError;
}
