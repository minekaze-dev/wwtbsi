import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '../types';

interface ModeSelectionModalProps {
  onSelectMode: (mode: GameMode) => void;
  onClose: () => void;
}

const ModeCard: React.FC<{
  mode: GameMode;
  title: string;
  description: string;
  prize: string;
  onSelect: () => void;
  bgColor: string;
}> = ({ mode, title, description, prize, onSelect, bgColor }) => {
  return (
    <div
      className={`p-6 rounded-xl border border-white/20 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:border-white/50 hover:scale-105 ${bgColor}`}
      onClick={onSelect}
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray-300 flex-grow">{description}</p>
      <div className="mt-4 text-yellow-400 font-bold text-lg">
        Hadiah Utama: {prize}
      </div>
    </div>
  );
};

const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({ onSelectMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full text-center shadow-2xl border border-white/10 relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Tutup"
        >
          <i className="fa-solid fa-times text-2xl"></i>
        </button>

        <h3 className="text-3xl font-extrabold text-white">Pilih Mode Permainan</h3>
        <p className="mt-2 text-gray-400">Pilih tingkat kesulitan tantangan Anda.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModeCard
            mode="NORMAL"
            title="Normal"
            description="Tantangan 25 pertanyaan dengan kurva kesulitan yang lebih landai. Cocok untuk pemanasan atau permainan cepat."
            prize="Rp 500 Juta"
            onSelect={() => onSelectMode('NORMAL')}
            bgColor="bg-gradient-to-br from-green-900/50 to-green-800/30"
          />
          <ModeCard
            mode="HARD"
            title="Hard"
            description="Tantangan 50 pertanyaan klasik dengan tingkat kesulitan yang terus meningkat tajam. Hanya untuk yang paling berani."
            prize="Rp 1 Miliar"
            onSelect={() => onSelectMode('HARD')}
            bgColor="bg-gradient-to-br from-red-900/50 to-red-800/30"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ModeSelectionModal;