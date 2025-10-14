import { GameMode, PrizeTier } from './types';

const NORMAL_PRIZE_TIERS: PrizeTier[] = [
    { step: 1, prize: 10000 }, { step: 2, prize: 25000 }, { step: 3, prize: 50000 }, { step: 4, prize: 100000 },
    { step: 5, prize: 200000 }, { step: 6, prize: 300000 }, { step: 7, prize: 400000 }, { step: 8, prize: 500000 },
    { step: 9, prize: 750000 }, { step: 10, prize: 1000000 }, { step: 11, prize: 2000000 }, { step: 12, prize: 3000000 },
    { step: 13, prize: 5000000 }, { step: 14, prize: 7500000 }, { step: 15, prize: 10000000 }, { step: 16, prize: 15000000 },
    { step: 17, prize: 20000000 }, { step: 18, prize: 30000000 }, { step: 19, prize: 40000000 }, { step: 20, prize: 50000000 },
    { step: 21, prize: 75000000 }, { step: 22, prize: 100000000 }, { step: 23, prize: 200000000 }, { step: 24, prize: 300000000 },
    { step: 25, prize: 500000000 },
];

const HARD_PRIZE_TIERS: PrizeTier[] = [
    { step: 1, prize: 10000 }, { step: 2, prize: 20000 }, { step: 3, prize: 30000 }, { step: 4, prize: 50000 },
    { step: 5, prize: 100000 }, { step: 6, prize: 150000 }, { step: 7, prize: 200000 }, { step: 8, prize: 300000 },
    { step: 9, prize: 400000 }, { step: 10, prize: 500000 }, { step: 11, prize: 750000 }, { step: 12, prize: 1000000 },
    { step: 13, prize: 1250000 }, { step: 14, prize: 1500000 }, { step: 15, prize: 2000000 }, { step: 16, prize: 2500000 },
    { step: 17, prize: 3000000 }, { step: 18, prize: 4000000 }, { step: 19, prize: 5000000 }, { step: 20, prize: 6000000 },
    { step: 21, prize: 7000000 }, { step: 22, prize: 8000000 }, { step: 23, prize: 9000000 }, { step: 24, prize: 10000000 },
    { step: 25, prize: 12500000 }, { step: 26, prize: 15000000 }, { step: 27, prize: 17500000 }, { step: 28, prize: 20000000 },
    { step: 29, prize: 22500000 }, { step: 30, prize: 25000000 }, { step: 31, prize: 30000000 }, { step: 32, prize: 40000000 },
    { step: 33, prize: 50000000 }, { step: 34, prize: 60000000 }, { step: 35, prize: 75000000 }, { step: 36, prize: 100000000 },
    { step: 37, prize: 125000000 }, { step: 38, prize: 150000000 }, { step: 39, prize: 200000000 }, { step: 40, prize: 250000000 },
    { step: 41, prize: 300000000 }, { step: 42, prize: 400000000 }, { step: 43, prize: 500000000 }, { step: 44, prize: 600000000 },
    { step: 45, prize: 700000000 }, { step: 46, prize: 800000000 }, { step: 47, prize: 850000000 }, { step: 48, prize: 900000000 },
    { step: 49, prize: 950000000 }, { step: 50, prize: 1000000000 },
];

export const GAME_MODES = {
    NORMAL: {
        questionCount: 25,
        prizeTiers: NORMAL_PRIZE_TIERS,
        guaranteedLevels: [5, 10, 15, 20, 25],
        leaderboardKey: 'quizmasterLeaderboard_normal'
    },
    HARD: {
        questionCount: 50,
        prizeTiers: HARD_PRIZE_TIERS,
        guaranteedLevels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        leaderboardKey: 'quizmasterLeaderboard_hard'
    }
};

export const AVATARS = ['🤖', '⚛️', '🎨', '🍎', '⚡️', '🚀', '🧠', '💡', '🏆', '🌟'];
