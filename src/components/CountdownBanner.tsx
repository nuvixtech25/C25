
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye } from 'lucide-react';

interface CountdownBannerProps {
  message: string;
  endTime: Date;
  bannerImageUrl?: string | null;
  containerClassName?: string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ 
  message, 
  endTime, 
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

  // Format numbers to always have two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      {/* Black bar with eye icon and countdown */}
      <div className="w-full bg-black py-2 px-4 flex justify-center items-center">
        <Eye className="text-white h-5 w-5 mr-2" />
        <div className="text-white text-sm md:text-base mr-2">
          {message}
        </div>
        <div className="flex items-center ml-auto">
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(timeLeft.hours)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">HORAS</span>
          </div>
          <span className="text-white text-xl md:text-2xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(timeLeft.minutes)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">MIN</span>
          </div>
          <span className="text-white text-xl md:text-2xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(timeLeft.seconds)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">SEG</span>
          </div>
        </div>
      </div>

      {/* Banner image below the countdown - ajustado para dimensão específica */}
      {bannerImageUrl && (
        <div className="w-full overflow-hidden">
          <img
            src={bannerImageUrl}
            alt="Promotional banner"
            className="w-full md:max-w-[666px] md:h-[200px] h-auto object-cover mx-auto"
          />
        </div>
      )}
    </div>
  );
};
