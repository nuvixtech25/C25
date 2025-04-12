
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
  containerClassName = ''
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      <TimerBanner 
        initialMinutes={initialMinutes} 
        initialSeconds={initialSeconds}
        message={message}
      />

      {bannerImageUrl && (
        <div 
          className="w-full flex items-center justify-center my-4" // Changed from mt-4 to my-4 to add vertical margin
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
