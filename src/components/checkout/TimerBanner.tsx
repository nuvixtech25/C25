
import React, { useState, useEffect } from 'react';

interface TimerBannerProps {
  message: string;
  initialMinutes: number;
  initialSeconds: number;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const TimerBanner: React.FC<TimerBannerProps> = ({ 
  message, 
  initialMinutes, 
  initialSeconds,
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    console.log('TimerBanner rendered with backgroundColor:', backgroundColor);
    console.log('TimerBanner rendered with bannerImageUrl:', bannerImageUrl);
    
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
  }, [minutes, seconds, backgroundColor, bannerImageUrl]);

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className="sticky top-0 w-full text-white py-2 z-10 bg-cover bg-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-bold flex items-center justify-center">
            <span className="mr-2">⏰</span>
            {message} {formatTime(minutes, seconds)}
          </p>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div className="sticky top-0 w-full text-white py-2 z-10" style={{ backgroundColor }}>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-bold flex items-center justify-center">
          <span className="mr-2">⏰</span>
          {message} {formatTime(minutes, seconds)}
        </p>
      </div>
    </div>
  );
};
