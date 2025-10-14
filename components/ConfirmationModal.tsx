import React from 'react';
import { motion } from 'framer-motion';

interface ConfirmationModalProps {
  prizeAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ prizeAmount, onConfirm, onCancel }) => {
  const formattedPrize = prizeAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-white/10"
      >
        <h3 className="text-2xl font-bold text-white">Konfirmasi</h3>
        <p className="mt-4 text-lg text-gray-300">
          Anda yakin ingin menyerah dan membawa pulang <span className="font-bold text-yellow-400">{formattedPrize}</span>?
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 text-white font-bold transition-transform transform hover:scale-105"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-black font-bold transition-transform transform hover:scale-105"
          >
            Ya, Saya Yakin
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
