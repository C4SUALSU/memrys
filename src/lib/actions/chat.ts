import { createClient } from '@/lib/supabase/server';

export async function getMessages(partnershipId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*, sender_id(display_name, avatar_url)')
        .eq('partnership_id', partnershipId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data;
}

export async function sendMessage(partnershipId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            partnership_id: partnershipId,
            sender_id: user.id,
            content
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}
