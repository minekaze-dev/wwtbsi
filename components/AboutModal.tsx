import React from 'react';
import { motion } from 'framer-motion';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full text-center shadow-2xl border border-white/10"
      >
        <h3 className="text-2xl font-bold text-yellow-400">Tentang Who Wants to Be a Smartest Indonesian</h3>
        <div className="mt-4 text-left text-gray-300 space-y-3 max-h-[60vh] overflow-y-auto pr-4 text-sm">
            <p>
                Selamat datang di "Who Wants to Be a Smartest Indonesian"! Ini bukan sekadar kuis biasa. Aplikasi ini adalah sebuah eksperimen untuk menggabungkan hiburan kuis klasik dengan kekuatan kecerdasan buatan (AI) modern untuk menciptakan pengalaman yang selalu baru dan menantang.
            </p>
            
            <h4 className="font-bold text-lg pt-2">Tujuan Kami</h4>
            <p>
                Tujuan utama kami adalah untuk menyediakan platform hiburan yang tidak hanya menyenangkan tetapi juga mendidik. Kami berharap kuis ini dapat menguji pengetahuan Anda, memicu rasa ingin tahu, dan memberikan tantangan yang memuaskan bagi semua orang di Indonesia.
            </p>

            <p className="font-semibold pt-2">
                Saran & Masukkan bisa kontak tim WWTBSI melalui email: wwtbsi.dev@gmail.com
            </p>
            <p>
                Terima kasih telah bermain. Selamat menikmati tantangan!
            </p>
            
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-transform transform hover:scale-105"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutModal;
