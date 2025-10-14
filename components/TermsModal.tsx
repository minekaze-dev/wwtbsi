import React from 'react';
import { motion } from 'framer-motion';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full text-center shadow-2xl border border-white/10"
      >
        <h3 className="text-2xl font-bold text-yellow-400">Syarat & Ketentuan</h3>
        <div className="mt-4 text-left text-gray-300 space-y-3 max-h-[60vh] overflow-y-auto pr-4 text-sm">
            <p>Dengan mengakses atau menggunakan aplikasi "Who Wants to Be a Smartest Indonesian" ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan ini.</p>
            
            <h4 className="font-bold text-lg pt-2">1. Aturan Permainan</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Layanan ini disediakan untuk tujuan hiburan dan pendidikan.</li>
                <li>Pemain harus mematuhi semua aturan yang dijelaskan dalam "Tata Cara Bermain", termasuk larangan berbuat curang dalam bentuk apapun.</li>
                <li><strong>Hadiah Virtual:</strong> Hadiah uang yang ditampilkan dalam permainan adalah sepenuhnya virtual dan hanya dimaksudkan untuk tujuan hiburan. Tidak ada uang nyata yang diberikan, dan tidak ada transaksi keuangan nyata yang terlibat dalam Layanan ini.</li>
                <li>Kami berhak untuk mendiskualifikasi pemain atau mereset papan peringkat jika ditemukan adanya kecurangan atau pelanggaran.</li>
            </ul>

            <h4 className="font-bold text-lg pt-2">2. Akun dan Data</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Anda tidak perlu membuat akun untuk bermain.</li>
                <li>Data papan peringkat (nama yang Anda masukkan dan skor) akan disimpan secara publik di database kami. Dengan mengirimkan nama Anda, Anda setuju untuk menampilkannya secara publik.</li>
                <li>Kami tidak mengumpulkan informasi pribadi lainnya.</li>
            </ul>

            <h4 className="font-bold text-lg pt-2">3. Kekayaan Intelektual</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Layanan dan konten aslinya, fitur, dan fungsionalitasnya adalah dan akan tetap menjadi milik eksklusif "Who Wants to Be a Smartest Indonesian" dan pemberi lisensinya.</li>
                <li>Pertanyaan yang dihasilkan oleh Gemini API adalah milik penyedia API tersebut dan digunakan di bawah lisensi yang berlaku.</li>
            </ul>

            <h4 className="font-bold text-lg pt-2">4. Batasan Tanggung Jawab</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Layanan disediakan "SEBAGAIMANA ADANYA", tanpa jaminan apapun. Kami tidak menjamin bahwa Layanan akan selalu tersedia, tidak terganggu, atau bebas dari kesalahan.</li>
                <li>Kami tidak bertanggung jawab atas kerugian atau kerusakan tidak langsung, insidental, khusus, konsekuensial, atau hukuman yang timbul dari penggunaan Anda atas Layanan.</li>
                <li>Akurasi pertanyaan dan jawaban yang dihasilkan oleh AI tidak dijamin 100%.</li>
            </ul>

            <h4 className="font-bold text-lg pt-2">5. Perubahan pada Ketentuan</h4>
            <p>Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Ketentuan ini kapan saja. Dengan terus mengakses atau menggunakan Layanan kami setelah revisi tersebut berlaku, Anda setuju untuk terikat oleh ketentuan yang direvisi.</p>
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

export default TermsModal;