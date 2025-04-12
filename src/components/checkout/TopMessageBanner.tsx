
import React from 'react';
import { TimerBanner } from './TimerBanner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye } from 'lucide-react';

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
  backgroundColor = 'transparent',
  bannerImageUrl = null,
  containerClassName = 'w-full'
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col items-center ${containerClassName}`}>
      {/* Black bar with eye icon, message, and timer */}
      <div className="w-full bg-black py-3 px-4 flex justify-center items-center space-x-4">
        <Eye className="text-white h-5 w-5 mr-2" />
        <div className="text-white text-sm md:text-base font-medium">
          {message}
        </div>
        <TimerBanner 
          initialMinutes={initialMinutes} 
          initialSeconds={initialSeconds} 
        />
      </div>

      {/* Banner image below the timer */}
      {bannerImageUrl && (
        <div 
          className="w-full flex items-center justify-center mt-0" 
          style={{ 
            backgroundImage: `url(${bannerImageUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: isMobile ? '180px' : '220px',
            maxWidth: '100%'
          }}
        />
      )}
    </div>
  );
};
