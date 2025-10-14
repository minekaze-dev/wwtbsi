
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full text-white">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <p className="mt-4 text-lg font-semibold tracking-wider">{message}</p>
      <p className="text-sm text-gray-400">Please wait a moment...</p>
    </div>
  );
};

export default LoadingSpinner;
