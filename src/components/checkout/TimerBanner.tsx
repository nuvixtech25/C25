
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

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
  const [hours, setHours] = useState(Math.floor(initialMinutes / 60));
  const [minutes, setMinutes] = useState(initialMinutes % 60);
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
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hours, minutes, seconds, backgroundColor, bannerImageUrl]);

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className="w-full bg-cover bg-center h-8 flex items-center justify-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="text-white text-sm font-medium">
          {message}
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div className="w-full h-8 flex items-center justify-center" style={{ backgroundColor }}>
      <div className="text-white text-sm font-medium">
        {message}
      </div>
    </div>
  );
};
