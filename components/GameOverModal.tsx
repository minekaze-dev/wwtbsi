import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FinalStats {
    prize: number;
    points: number;
    time: number;
}

interface GameOverModalProps {
  finalStats: FinalStats;
  isWinner: boolean;
  walkAway: boolean;
  disqualified: boolean;
  timedOut: boolean;
  onSubmitName: (name: string) => void;
}

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


const GameOverModal: React.FC<GameOverModalProps> = ({ finalStats, isWinner, walkAway, disqualified, timedOut, onSubmitName }) => {
    const [name, setName] = useState('');
    const [copied, setCopied] = useState(false);

    const formattedWinnings = finalStats.prize.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

    let title = "Permainan Berakhir";
    let message = `Anda menjawab salah. Anda akan pulang dengan ${formattedWinnings}.`;

    if (timedOut) {
        title = "Waktu Habis";
        message = `Sayang sekali, waktu Anda habis. Anda pulang dengan hadiah dari titik aman terakhir: ${formattedWinnings}.`;
    } else if (disqualified) {
        title = "Diskualifikasi";
        message = `Permainan dihentikan karena Anda meninggalkan tab. Anda pulang dengan hadiah dari titik aman terakhir: ${formattedWinnings}.`;
    } else if (isWinner) {
        title = "JUARA!";
        message = `Anda adalah Pemenang Utama! Anda membawa pulang ${formattedWinnings}!`;
    } else if (walkAway) {
        title = "Selamat!";
        message = `Anda berhasil membawa pulang ${formattedWinnings}!`;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitName(name.trim() || 'Anonymous');
    };

    const handleShare = async () => {
        const shareText = `Saya baru saja menyelesaikan kuis "Who Wants to Be a Smartest Indonesian" dan memenangkan ${formattedWinnings} dengan ${finalStats.points} poin dalam waktu ${formatTime(finalStats.time)}! Bisakah kamu mengalahkan skorku?`;
        const shareData = {
            title: 'Who Wants to Be a Smartest Indonesian',
            text: shareText,
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
                await navigator.clipboard.writeText(`${shareText}\n\nTantang dirimu di sini: ${window.location.href}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Error copying to clipboard:', error);
            }
        }
    };

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl border border-white/10"
      >
        <h3 className="text-4xl font-extrabold text-yellow-400">{title}</h3>
        <p className="mt-4 text-lg text-gray-200">
            {message}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4 text-white border-t border-b border-white/10 py-4">
            <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Hadiah</div>
                <div className="text-xl font-bold text-yellow-400">{formattedWinnings}</div>
            </div>
            <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Poin</div>
                <div className="text-xl font-bold">{finalStats.points.toLocaleString('id-ID')}</div>
            </div>
            <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Waktu</div>
                <div className="text-xl font-bold">{formatTime(finalStats.time)}</div>
            </div>
        </div>

        <div className="mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <p className="text-sm font-semibold">Catat skormu di papan peringkat! Masukkan nama Anda:</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pemain Jenius"
                    maxLength={20}
                    className="px-4 py-2 w-full max-w-xs rounded-lg bg-white/10 border border-white/20 text-white text-center focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                <div className="flex gap-3 w-full max-w-xs">
                    <button 
                        type="button" 
                        onClick={handleShare}
                        className={`flex-1 px-4 py-3 rounded-lg transition-colors text-white font-bold ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                    >
                        {copied ? 'Tersalin!' : 'Bagikan Skor'}
                    </button>
                    <button type="submit" className="flex-1 px-4 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-black font-bold transition-transform transform hover:scale-105">
                        Kirim
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverModal;