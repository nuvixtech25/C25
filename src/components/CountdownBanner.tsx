
import React, { useState, useEffect } from 'react';

interface CountdownBannerProps {
  message: string;
  endTime: Date | string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  message,
  endTime
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Handle both Date objects and ISO strings
      const endTimeDate = endTime instanceof Date ? endTime : new Date(endTime);
      
      // Make sure the date is valid before proceeding
      if (isNaN(endTimeDate.getTime())) {
        console.error('Invalid date provided to CountdownBanner:', endTime);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const difference = endTimeDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timerId);
  }, [endTime]);
  
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };
  
  return (
    <div className="bg-gradient-to-r from-asaas-primary to-asaas-secondary text-white py-3 px-4 rounded-lg text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <p className="font-medium">{message}</p>
        <div className="flex items-center">
          <div className="bg-white/20 px-2 py-1 rounded text-white font-mono">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="mx-1">:</span>
          <div className="bg-white/20 px-2 py-1 rounded text-white font-mono">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="mx-1">:</span>
          <div className="bg-white/20 px-2 py-1 rounded text-white font-mono">
            {formatTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
};
