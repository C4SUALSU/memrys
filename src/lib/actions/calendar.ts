import { createClient } from '@/lib/supabase/server';

export async function getEvents(partnershipId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('calendar_events')
        .select('*, author_id(display_name, avatar_url)')
        .eq('partnership_id', partnershipId)
        .order('event_date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data;
}

export async function createEvent(
    partnershipId: string,
    title: string,
    description: string | null,
    eventDate: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('calendar_events')
        .insert({
            partnership_id: partnershipId,
            author_id: user.id,
            title,
            description,
            event_date: eventDate
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}
