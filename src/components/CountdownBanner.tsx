
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface CountdownBannerProps {
  message: string;
  endTime: Date;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
  containerClassName?: string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ 
  message, 
  endTime, 
  backgroundColor = 'transparent',
  bannerImageUrl = null,
  containerClassName = 'w-full'
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

  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      {/* Changed background from bg-black to bg-transparent */}
      <div className="w-full bg-transparent py-2 px-4 flex justify-center items-center space-x-4 rounded-t-md">
        <div className="text-black text-sm md:text-base lg:text-lg font-medium">
          {message}
        </div>
        <div className="text-black text-sm md:text-lg lg:text-xl font-medium">
          {timeDisplay}
        </div>
      </div>

      {/* Banner image container */}
      {bannerImageUrl && (
        <div 
          className="w-full flex items-center justify-center overflow-hidden mt-4 mb-4" 
          style={{ 
            backgroundColor,
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: isMobile ? '180px' : '220px', // Mantendo a altura maior para visibilidade
            maxWidth: '100%'
          }}
        />
      )}
    </div>
  );
};
