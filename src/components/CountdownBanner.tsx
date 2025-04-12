
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { Clock } from 'lucide-react';

interface CountdownBannerProps {
  message: string;
  endTime: Date;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ message, endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 });
        return;
      }
      
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 text-center mb-0">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        <Clock className="h-5 w-5 mr-2 text-yellow-300" />
        <span className="text-base md:text-lg">
          {message} <span className="font-bold text-yellow-300">{formatTime(timeLeft.minutes, timeLeft.seconds)}</span>
        </span>
      </div>
    </div>
  );
};
