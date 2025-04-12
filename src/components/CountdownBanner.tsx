
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

  // Countdown timer container (positioned at the top)
  const timerContainerClass = "w-full bg-black py-2 px-4 text-center";
  
  // Main banner container - full size
  const containerClass = isMobile 
    ? "w-full max-w-full" 
    : "w-full max-w-4xl";

  return (
    <div className="flex flex-col w-full items-center">
      {/* Countdown timer at the top */}
      <div className={timerContainerClass}>
        <div className="text-white text-center text-sm md:text-lg lg:text-xl font-medium">
          {timeDisplay}
        </div>
      </div>

      {/* Main banner below the timer */}
      <div 
        className={`${containerClass} mt-2 flex items-center justify-center rounded-lg overflow-hidden`}
        style={{ 
          backgroundColor,
          backgroundImage: bannerImageUrl ? `url(${bannerImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: isMobile ? '120px' : '150px'
        }}
      >
        <div className="p-4 md:p-6">
          <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
