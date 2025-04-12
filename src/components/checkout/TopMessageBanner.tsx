
import React from 'react';
import { TimerBanner } from './TimerBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopMessageBannerProps {
  message: string;
  initialMinutes?: number;
  initialSeconds?: number;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  initialMinutes = 5,
  initialSeconds = 0,
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const isMobile = useIsMobile();
  
  // Main banner container - full size
  const containerClass = isMobile 
    ? "w-full max-w-full" 
    : "w-full max-w-full";

  return (
    <div className="flex flex-col w-full items-center">
      {/* Black bar with message and timer side by side */}
      <div className="w-full bg-black py-2 px-4 flex justify-center items-center space-x-4">
        <div className="text-white text-sm md:text-base lg:text-lg font-medium">
          {message}
        </div>
        <TimerBanner 
          initialMinutes={initialMinutes} 
          initialSeconds={initialSeconds} 
        />
      </div>

      {/* Main banner below the timer */}
      {bannerImageUrl && (
        <div 
          className={`${containerClass} flex items-center justify-center overflow-hidden`}
          style={{ 
            backgroundColor,
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: isMobile ? '120px' : '150px'
          }}
        />
      )}
    </div>
  );
};
