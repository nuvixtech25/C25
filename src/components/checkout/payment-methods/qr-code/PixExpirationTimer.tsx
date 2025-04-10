
import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface PixExpirationTimerProps {
  timeLeft: string;
  isExpired?: boolean;
}

export const PixExpirationTimer: React.FC<PixExpirationTimerProps> = ({ 
  timeLeft,
  isExpired = false
}) => {
  if (isExpired) {
    return (
      <div className="flex items-center justify-center space-x-2 text-red-500 font-medium">
        <AlertCircle className="h-4 w-4" />
        <span>Tempo expirado</span>
      </div>
    );
  }
  
  return (
    <div className="text-sm text-center text-muted-foreground">
      {timeLeft ? (
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Expira em: <span className="font-semibold">{timeLeft}</span></span>
        </div>
      ) : (
        <span>Carregando tempo restante...</span>
      )}
    </div>
  );
};
