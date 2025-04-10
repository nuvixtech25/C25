
import React from 'react';

interface PixExpirationTimerProps {
  timeLeft: string;
}

export const PixExpirationTimer: React.FC<PixExpirationTimerProps> = ({ timeLeft }) => {
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
