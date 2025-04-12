
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface TimerBannerProps {
  initialMinutes: number;
  initialSeconds: number;
}

export const TimerBanner: React.FC<TimerBannerProps> = ({ 
  initialMinutes, 
  initialSeconds
}) => {
  const [hours, setHours] = useState(Math.floor(initialMinutes / 60));
  const [minutes, setMinutes] = useState(initialMinutes % 60);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hours, minutes, seconds]);

  // Format numbers to always have two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <div className="flex flex-col items-center">
        <span className="text-white text-lg md:text-2xl lg:text-3xl font-bold">{formatNumber(hours)}</span>
        <span className="text-white text-[8px] md:text-xs uppercase">HORAS</span>
      </div>
      <span className="text-white text-lg md:text-2xl lg:text-3xl font-bold">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white text-lg md:text-2xl lg:text-3xl font-bold">{formatNumber(minutes)}</span>
        <span className="text-white text-[8px] md:text-xs uppercase">MIN</span>
      </div>
      <span className="text-white text-lg md:text-2xl lg:text-3xl font-bold">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white text-lg md:text-2xl lg:text-3xl font-bold">{formatNumber(seconds)}</span>
        <span className="text-white text-[8px] md:text-xs uppercase">SEG</span>
      </div>
    </div>
  );
};
