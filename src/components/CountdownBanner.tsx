
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';

interface CountdownBannerProps {
  message: string;
  endTime: Date;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ 
  message, 
  endTime, 
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
    return null;
  }

  const timeDisplay = `${timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ''}${timeLeft.minutes > 0 ? `${timeLeft.minutes}m ` : ''}${timeLeft.seconds}s`;

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className="w-[800px] h-[600px] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="flex flex-col items-center">
          <div className="text-white text-sm font-medium mb-2">
            {message}
          </div>
          <div className="text-white text-sm font-medium">
            {timeDisplay}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div 
      className="w-[800px] h-[600px] flex items-center justify-center" 
      style={{ backgroundColor }}
    >
      <div className="flex flex-col items-center">
        <div className="text-white text-sm font-medium mb-2">
          {message}
        </div>
        <div className="text-white text-sm font-medium">
          {timeDisplay}
        </div>
      </div>
    </div>
  );
};
