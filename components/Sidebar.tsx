import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrizeTier } from '../types';

interface SidebarProps {
  currentQuestionIndex: number;
  prizeTiers: PrizeTier[];
  guaranteedLevels: number[];
  onWalkAway: () => void;
  isPlaying: boolean;
  points: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentQuestionIndex, prizeTiers, guaranteedLevels, onWalkAway, isPlaying, points }) => {
  
  const [currentPage, setCurrentPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const prizesPerPage = 10;
  const totalPages = Math.ceil(prizeTiers.length / prizesPerPage);

  useEffect(() => {
    // Automatically switch to the page containing the current question
    const activePageIndex = Math.floor(currentQuestionIndex / prizesPerPage);
    if (activePageIndex !== currentPage) {
      setCurrentPage(activePageIndex);
    }
  }, [currentQuestionIndex, prizeTiers]);

  // Reset to first page when prize tiers change (new game mode)
  useEffect(() => {
    setCurrentPage(0);
  }, [prizeTiers]);


  const prizesToShow = prizeTiers.slice(
    currentPage * prizesPerPage,
    (currentPage + 1) * prizesPerPage
  );
  
  const handleShare = async () => {
    const shareData = {
        title: 'Who Wants to Be a Smartest Indonesian',
        text: 'Saya menantangmu di kuis Who Wants to Be a Smartest Indonesian! Bisakah kamu mengalahkan skorku?',
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }
  };


  return (
    <aside className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-4 h-full">
      {isPlaying && (
        <div className="p-3 bg-white/5 rounded-lg text-center flex-shrink-0">
          <h3 className="text-xs text-gray-300 uppercase font-bold tracking-wider">Skor</h3>
          <p className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</p>
        </div>
      )}

      <div className="p-3 bg-white/5 rounded-lg flex-grow flex flex-col min-h-0">
        <h3 className="text-xs text-gray-300 uppercase font-bold tracking-wider mb-2">Prize Ladder</h3>
        
        <div className="flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.ul
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 h-full"
            >
              {prizesToShow.slice().reverse().map((tier) => (
                <li 
                  key={tier.step} 
                  className={`flex justify-between py-1 px-3 rounded transition-all duration-300 text-sm
                    ${tier.step === currentQuestionIndex + 1 ? 'bg-yellow-500/80 text-black font-extrabold scale-105' 
                    : guaranteedLevels.includes(tier.step) ? 'text-yellow-400 font-bold' 
                    : 'text-gray-300'}`
                  }
                >
                  <span>{tier.step}</span>
                  <span>{tier.prize.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {totalPages > 1 && <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <button 
            onClick={() => setCurrentPage(p => p - 1)} 
            disabled={currentPage === 0}
            className="px-3 py-1 rounded disabled:opacity-30 enabled:hover:bg-white/10 transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="text-xs font-semibold">
            {currentPage + 1} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => p + 1)} 
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 rounded disabled:opacity-30 enabled:hover:bg-white/10 transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>}
      </div>

      {isPlaying && <div className="p-3 bg-white/5 rounded-lg text-sm flex-shrink-0">
        <h3 className="font-semibold mb-2 text-xs text-gray-300 uppercase font-bold tracking-wider">Game Controls</h3>
          <button onClick={onWalkAway} className="w-full px-3 py-2 bg-yellow-600/80 hover:bg-yellow-500 rounded transition-colors text-black font-bold">
            Menyerah
          </button>
      </div>}

       {!isPlaying && <div className="p-3 bg-white/5 rounded-lg text-sm flex-shrink-0">
        <h3 className="font-semibold mb-2 text-xs text-gray-300 uppercase font-bold tracking-wider text-center">Tantang Temanmu!</h3>
        <p className="text-center text-xs text-gray-400 mb-3">Ajak temanmu untuk bermain dan lihat siapa yang paling pintar!</p>
          <button 
            onClick={handleShare} 
            className={`w-full px-3 py-2 rounded transition-colors text-white font-bold ${copied ? 'bg-green-600' : 'bg-indigo-600/80 hover:bg-indigo-500'}`}
          >
            {copied ? 'Tautan Disalin!' : 'Bagikan Tantangan'}
          </button>
      </div>}
    </aside>
  );
};

export default Sidebar;