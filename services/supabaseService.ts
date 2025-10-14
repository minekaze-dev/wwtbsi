import { supabase } from '../lib/supabaseClient';
import { GameMode, LeaderboardEntry } from '../types';

type LeaderboardInsert = Omit<LeaderboardEntry, 'id' | 'created_at'>;

export const fetchLeaderboard = async (mode: GameMode): Promise<LeaderboardEntry[]> => {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('game_mode', mode)
        .order('score', { ascending: false })
        .order('time_seconds', { ascending: true })
        .limit(5);

    if (error) {
        console.error(`Error fetching ${mode} leaderboard:`, error);
        throw error;
    }

    return (data || []) as LeaderboardEntry[];
};

export const addLeaderboardEntry = async (entry: LeaderboardInsert): Promise<void> => {
    const { error } = await supabase.from('leaderboard').insert([entry]);

    if (error) {
        console.error('Error adding leaderboard entry:', error);
        throw error;
    }
};
