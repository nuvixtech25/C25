
import React from 'react';
import { TimerBanner } from './TimerBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopMessageBannerProps {
  message: string;
  initialMinutes?: number;
  initialSeconds?: number;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
  containerClassName?: string;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  initialMinutes = 5,
  initialSeconds = 0,
  backgroundColor = '#000000',
  bannerImageUrl = null,
  containerClassName = 'w-full'
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      {/* Black bar with message and timer side by side */}
      <div className="w-full bg-black py-2 px-4 flex justify-center items-center space-x-4 rounded-t-md">
        <div className="text-white text-sm md:text-base lg:text-lg font-medium">
          {message}
        </div>
        <TimerBanner 
          initialMinutes={initialMinutes} 
          initialSeconds={initialSeconds} 
        />
      </div>

      {/* Added mt-4 to create more space between the message and the banner */}
      {bannerImageUrl && (
        <div 
          className="w-full flex items-center justify-center overflow-hidden mt-4 mb-4" 
          style={{ 
            backgroundColor,
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: isMobile ? '80px' : '110px'
          }}
        />
      )}
    </div>
  );
};
