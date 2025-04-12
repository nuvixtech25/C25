
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

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white text-center py-2 z-50">
      {timeDisplay}
    </div>
  );
};

