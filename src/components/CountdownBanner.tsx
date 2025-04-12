import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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

  // Main banner container - full size
  const containerClass = isMobile 
    ? "w-full max-w-full" 
    : "w-full max-w-full";

  return (
    <div className="flex flex-col w-full items-center">
      {/* Black bar with message and countdown side by side */}
      <div className="w-full bg-black py-2 px-4 flex justify-center items-center space-x-4">
        <div className="text-white text-sm md:text-base lg:text-lg font-medium">
          {message}
        </div>
        <div className="text-white text-sm md:text-lg lg:text-xl font-medium">
          {timeDisplay}
        </div>
      </div>

      {/* Main banner below the timer */}
      {bannerImageUrl && (
        <div 
          className={`${containerClass} flex items-center justify-center overflow-hidden`}
          style={{ 
            backgroundColor,
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: isMobile ? '120px' : '150px'
          }}
        />
      )}
    </div>
  );
};
