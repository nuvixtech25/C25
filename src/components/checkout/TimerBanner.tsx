
import React, { useState, useEffect } from 'react';

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

  return (
    <div className="text-black text-sm md:text-lg lg:text-xl font-medium">
      {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m `}{seconds}s
    </div>
  );
};
