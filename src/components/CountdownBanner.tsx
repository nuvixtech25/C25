
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

  // Responsive container classes - adjusted to match form width
  const containerClass = isMobile 
    ? "w-full px-4 py-3 max-w-full" 
    : "w-full max-w-4xl px-4 py-4";
  
  const contentClass = isMobile
    ? "p-3"
    : "p-4";

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className={`${containerClass} bg-cover bg-center flex items-center justify-center rounded-lg overflow-hidden`}
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className={`flex flex-col items-center ${contentClass}`}>
          <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium mb-2">
            {message}
          </div>
          <div className="text-white text-center text-sm md:text-lg lg:text-xl font-medium">
            {timeDisplay}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div 
      className={`${containerClass} flex items-center justify-center rounded-lg overflow-hidden`}
      style={{ backgroundColor }}
    >
      <div className={`flex flex-col items-center ${contentClass}`}>
        <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium mb-2">
          {message}
        </div>
        <div className="text-white text-center text-sm md:text-lg lg:text-xl font-medium">
          {timeDisplay}
        </div>
      </div>
    </div>
  );
};
