
import React, { useState, useEffect } from 'react';

interface TimerBannerProps {
  message: string;
  initialMinutes: number;
  initialSeconds: number;
}

export const TimerBanner: React.FC<TimerBannerProps> = ({ 
  message, 
  initialMinutes, 
  initialSeconds 
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-0 w-full bg-[#FF0000] text-white py-2 z-10">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-bold">
          {message} {formatTime(minutes, seconds)}
        </p>
      </div>
    </div>
  );
};
