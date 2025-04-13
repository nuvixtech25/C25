
import React from 'react';
import { Timer, X } from 'lucide-react';

interface PixExpirationTimerProps {
  timeLeft: string;
  isExpired: boolean;
}

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const PixExpirationTimer: React.FC<PixExpirationTimerProps> = ({ 
  timeLeft,
  isExpired 
}) => {
  // Convert timeLeft to number since it comes as string
  const timeLeftNumber = parseInt(timeLeft, 10) || 0;
  
  if (isExpired) {
    return (
      <div className="flex items-center text-red-500 font-medium">
        <X className="mr-2 h-4 w-4" />
        <span>Tempo expirado</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-600">
        <Timer className="mr-2 h-4 w-4 text-purple-500" />
        <span>Expira em:</span>
      </div>
      
      <div className="text-sm font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
        {formatTime(timeLeftNumber)}
      </div>
    </div>
  );
};
