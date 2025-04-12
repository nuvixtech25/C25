
import React from 'react';
import { TimerBanner } from './TimerBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopMessageBannerProps {
  message: string;
  initialMinutes?: number;
  initialSeconds?: number;
  bannerImageUrl?: string | null;
  containerClassName?: string;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  initialMinutes = 5,
  initialSeconds = 0,
  bannerImageUrl = null,
  containerClassName = 'w-full'
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      {/* Black bar with eye icon, message, and timer */}
      <TimerBanner 
        initialMinutes={initialMinutes} 
        initialSeconds={initialSeconds}
        message={message}
      />

      {/* Banner image below the timer - Adicionando mais espaço na versão desktop */}
      {bannerImageUrl && (
        <div 
          className="w-full flex items-center justify-center mt-6 md:mt-12" 
          style={{ 
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: isMobile ? '180px' : '250px',
            maxWidth: '100%'
          }}
        />
      )}
    </div>
  );
};
