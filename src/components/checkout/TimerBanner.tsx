
import React, { useState, useEffect } from 'react';

interface TimerBannerProps {
  message: string;
  initialMinutes: number;
  initialSeconds: number;
  backgroundColor?: string; // Nova propriedade para cor personalizada
}

export const TimerBanner: React.FC<TimerBannerProps> = ({ 
  message, 
  initialMinutes, 
  initialSeconds,
  backgroundColor = '#000000' // Cor padrão preta
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
    <div className="sticky top-0 w-full text-white py-2 z-10" style={{ backgroundColor }}>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-bold flex items-center justify-center">
          <span className="mr-2">⏰</span>
          {message} {formatTime(minutes, seconds)}
        </p>
      </div>
    </div>
  );
};
