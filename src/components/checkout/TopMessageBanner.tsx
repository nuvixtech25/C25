
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopMessageBannerProps {
  message: string;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className="w-full flex items-center justify-center"
      style={{ 
        backgroundColor,
        backgroundImage: bannerImageUrl ? `url(${bannerImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: isMobile ? '120px' : '200px'
      }}
    >
      <div className="w-full max-w-6xl px-4 py-6 text-center">
        <div className="text-white text-sm md:text-base lg:text-lg font-medium">
          {message}
        </div>
      </div>
    </div>
  );
};

