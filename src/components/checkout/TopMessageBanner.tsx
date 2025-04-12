
import React from 'react';
import { TimerBanner } from './TimerBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopMessageBannerProps {
  message: string;
  showTimer?: boolean;
  initialMinutes?: number;
  initialSeconds?: number;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  showTimer = false,
  initialMinutes = 5,
  initialSeconds = 0,
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const isMobile = useIsMobile();
  
  // Timer container at the top
  const timerContainerClass = "w-full bg-black py-2 px-4 text-center";
  
  // Main banner container - full size
  const containerClass = isMobile 
    ? "w-full max-w-full" 
    : "w-full max-w-4xl";

  return (
    <div className="flex flex-col w-full items-center">
      {/* Timer at the top (if showTimer is true) */}
      {showTimer && (
        <div className={timerContainerClass}>
          <TimerBanner 
            initialMinutes={initialMinutes} 
            initialSeconds={initialSeconds} 
          />
        </div>
      )}

      {/* Main banner with background image if URL is provided */}
      <div 
        className={`${containerClass} ${showTimer ? 'mt-2' : ''} flex items-center justify-center rounded-lg overflow-hidden`}
        style={{ 
          backgroundColor,
          backgroundImage: bannerImageUrl ? `url(${bannerImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: isMobile ? '120px' : '150px'
        }}
      >
        <div className="p-4 md:p-6">
          <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
