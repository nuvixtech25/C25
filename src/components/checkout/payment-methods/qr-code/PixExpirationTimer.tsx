
import React, { useEffect, useState } from 'react';

interface PixExpirationTimerProps {
  expirationDate: string;
}

export const PixExpirationTimer: React.FC<PixExpirationTimerProps> = ({ expirationDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationTime = new Date(expirationDate).getTime();
      const now = new Date().getTime();
      const difference = expirationTime - now;
      
      if (difference <= 0) {
        return '00:00:00';
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    };
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [expirationDate]);
  
  return (
    <p className="text-sm text-center text-muted-foreground">
      {timeLeft ? (
        <span>Expira em: <span className="font-semibold">{timeLeft}</span></span>
      ) : (
        <span>Carregando tempo restante...</span>
      )}
    </p>
  );
};
