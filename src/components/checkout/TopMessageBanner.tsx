
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
  
  // Adjustments for mobile view
  const containerClass = isMobile 
    ? "w-full max-w-[100vw] h-auto aspect-video overflow-hidden" 
    : "w-[800px] h-[600px]";
  
  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className={`${containerClass} bg-cover bg-center flex items-center justify-center`}
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="flex flex-col items-center">
          <div className="text-white text-sm font-medium mb-2">
            {message}
          </div>
          {showTimer && (
            <TimerBanner 
              initialMinutes={initialMinutes} 
              initialSeconds={initialSeconds} 
            />
          )}
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div 
      className={`${containerClass} flex items-center justify-center`}
      style={{ backgroundColor }}
    >
      <div className="flex flex-col items-center">
        <div className="text-white text-sm font-medium mb-2">
          {message}
        </div>
        {showTimer && (
          <TimerBanner 
            initialMinutes={initialMinutes} 
            initialSeconds={initialSeconds} 
          />
        )}
      </div>
    </div>
  );
};
