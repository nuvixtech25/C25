
import React, { useState, useEffect } from 'react';

interface TopMessageBannerProps {
  message: string;
  initialMinutes: number;
  initialSeconds: number;
  bannerImageUrl?: string | null;
  containerClassName?: string;
  bannerColor?: string; // Add bannerColor prop
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  initialMinutes,
  initialSeconds,
  bannerImageUrl,
  containerClassName = "",
  bannerColor = "#000000" // Default color is black
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  // Set timer styles based on whether a banner image is provided
  const bannerStyle = bannerImageUrl
    ? {
        backgroundImage: `url(${bannerImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'transparent'
      }
    : {
        backgroundColor: bannerColor || 'var(--banner-color, #000000)'
      };

  return (
    <div 
      className={`${containerClassName} rounded-md overflow-hidden mb-6`}
      style={bannerStyle}
    >
      <div className="bg-black bg-opacity-60 text-white p-3 text-center">
        <div className="text-sm md:text-base font-medium">{message}</div>
        <div className="text-xs md:text-sm mt-1">
          Termina em: <span className="font-bold">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
