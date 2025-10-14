import React from 'react';
import { motion } from 'framer-motion';

interface EtiquetteModalProps {
  onClose: () => void;
}

const EtiquetteModal: React.FC<EtiquetteModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl border border-white/10"
      >
        <h3 className="text-2xl font-bold text-yellow-400">Tata Cara Bermain</h3>
        <div className="mt-4 text-left text-gray-300 space-y-3">
            <p>Selamat datang di Who Wants to Be a Smartest Indonesian! Demi menjaga keseruan dan integritas permainan, harap patuhi beberapa aturan sederhana:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>
                    <strong>Jawab dengan Jujur:</strong> Andalkan pengetahuan Anda sendiri untuk menjawab setiap pertanyaan.
                </li>
                <li>
                    <strong>Dilarang Curang:</strong> Dilarang keras memotret soal, mencari jawaban di Google, menggunakan ChatGPT, atau bentuk bantuan eksternal lainnya selama permainan.
                </li>
                 <li>
                    <strong>Manfaatkan Bantuan Internal:</strong> Gunakan bantuan yang telah disediakan di dalam permainan (50:50, Tanya Audiens, Chat Teman) secara strategis.
                </li>
                 <li>
                    <strong>Perhatikan Waktu:</strong> Setiap pertanyaan memiliki batas waktu! Anda punya <strong>30 detik</strong> untuk soal umum dan <strong>90 detik</strong> untuk soal perhitungan matematika.
                </li>
                 <li>
                    <strong>Tetap Fokus pada Permainan:</strong> Meninggalkan tab browser atau beralih ke aplikasi lain selama kuis akan mengakibatkan diskualifikasi otomatis.
                </li>
            </ul>
            <p className="text-center font-semibold pt-2">Mari bermain dengan adil dan buktikan bahwa Anda adalah yang terpintar!</p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition-transform transform hover:scale-105"
          >
            Saya Mengerti & Lanjutkan
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EtiquetteModal;