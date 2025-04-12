
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
  
  // Responsive container classes - adjusted to match form width
  const containerClass = isMobile 
    ? "w-full px-4 py-3 max-w-full" 
    : "w-full max-w-4xl px-4 py-4";
  
  const contentClass = isMobile
    ? "p-3"
    : "p-4";

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className={`${containerClass} bg-cover bg-center flex items-center justify-center rounded-lg overflow-hidden`}
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className={`flex flex-col items-center ${contentClass}`}>
          <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium mb-2">
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
      className={`${containerClass} flex items-center justify-center rounded-lg overflow-hidden`}
      style={{ backgroundColor }}
    >
      <div className={`flex flex-col items-center ${contentClass}`}>
        <div className="text-white text-center text-sm md:text-base lg:text-lg font-medium mb-2">
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
