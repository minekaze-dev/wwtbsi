import { supabase } from '../lib/supabaseClient';
import { GameMode, LeaderboardEntry } from '../types';

type LeaderboardInsert = Omit<LeaderboardEntry, 'id' | 'created_at'>;

export const fetchLeaderboard = async (mode: GameMode): Promise<LeaderboardEntry[]> => {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('game_mode', mode)
        .order('time_seconds', { ascending: true })
        .limit(5);

    if (error) {
        console.error(`Error fetching ${mode} leaderboard:`, error);
        throw error;
    }

    // Supabase client might return a different structure, so we ensure the fields match our LeaderboardEntry type
    return (data || []).map(item => ({
        ...item,
        time: item.time_seconds // Ensure the field name matches what the component expects
    })) as LeaderboardEntry[];
};

export const addLeaderboardEntry = async (entry: LeaderboardInsert): Promise<void> => {
    const { error } = await supabase.from('leaderboard').insert([entry]);

    if (error) {
        console.error('Error adding leaderboard entry:', error);
        throw error;
    }
};
