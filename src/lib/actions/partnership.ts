import { createClient } from '@/lib/supabase/server';
import { Partnership } from '@/types/database';

export async function getPartnerships() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('partnerships')
        .select('*, user_1_id(email, display_name, avatar_url), user_2_id(email, display_name, avatar_url)')
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`);

    if (error) {
        console.error('Error fetching partnerships:', error);
        return [];
    }

    return data;
}

export async function invitePartner(email: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // 1. Find the target user by email
    const { data: targetProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if (profileError || !targetProfile) {
        throw new Error('User not found. They must sign in to Memory Jar at least once first.');
    }

    // 2. Create the partnership record
    const { data, error } = await supabase
        .from('partnerships')
        .insert({
            user_1_id: user.id,
            user_2_id: targetProfile.id,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function acceptPartnership(partnershipId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('partnerships')
        .update({ status: 'active' })
        .eq('id', partnershipId);

    if (error) throw error;
}
