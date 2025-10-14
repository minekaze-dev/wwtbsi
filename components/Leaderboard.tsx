import React from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  title: string;
}

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full"
    >
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 h-full flex flex-col">
        <h2 className="text-center text-xs text-gray-300 uppercase font-bold tracking-wider mb-2 flex-shrink-0">
          {title}
        </h2>
        <p className="text-center text-xs text-indigo-400">Direset setiap minggu</p>
        <p className="text-center text-xs text-gray-400 mb-4">Peringkat berdasarkan hadiah tertinggi & waktu tercepat.</p>
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <motion.div
                key={`${player.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3"
              >
                <div className="text-xl sm:text-2xl">{player.avatar}</div>
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{player.name}</div>
                  <div className="text-xs text-indigo-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="whitespace-nowrap">🏆 {player.score.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
                    <span className="whitespace-nowrap">⭐ {player.points.toLocaleString('id-ID')} Pts</span>
                    <span className="whitespace-nowrap">⏱️ {formatTime(player.time_seconds)}</span>
                  </div>
                </div>
                <div className="font-bold text-base text-yellow-400 ml-auto pl-2">#{index + 1}</div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-400 mt-8">
              Papan peringkat masih kosong.
              <br/>
              Jadilah yang pertama!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
