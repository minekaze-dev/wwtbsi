import React from 'react';

interface TimerProgressBarProps {
  timeLeft: number;
  totalDuration: number;
}

const TimerProgressBar: React.FC<TimerProgressBarProps> = ({ timeLeft, totalDuration }) => {
  const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;

  const getBarColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full my-3 px-4">
      <div className="flex justify-between items-center mb-1 text-white">
        <span className="text-sm font-semibold">Waktu Tersisa</span>
        <span className="text-lg font-bold">{timeLeft}</span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-linear ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimerProgressBar;
