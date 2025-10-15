import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Leaderboard from './Leaderboard';
import { LeaderboardEntry } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  hardLeaderboard: LeaderboardEntry[];
  normalLeaderboard: LeaderboardEntry[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, hardLeaderboard, normalLeaderboard }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900/90 backdrop-blur-lg z-50 flex flex-col p-6 shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 id="mobile-menu-title" className="text-xl font-bold text-yellow-400">Top Smartest</h2>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white transition-colors" aria-label="Tutup menu">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="flex-grow flex flex-col gap-6 overflow-y-auto -mr-2 pr-2">
              <Leaderboard leaderboard={hardLeaderboard} title="Top Smartest - Hard" />
              <Leaderboard leaderboard={normalLeaderboard} title="Top Smartest - Normal" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
