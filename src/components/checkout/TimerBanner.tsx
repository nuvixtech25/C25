
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
        className="sticky top-0 w-full text-white py-2 z-10 bg-cover bg-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Eye className="h-5 w-5 mr-2" />
          <span className="text-sm">
            {message} {' '}
          </span>
          <div className="flex items-center ml-2">
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{hours.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">horas</span>
            </div>
            <span className="text-xl font-bold mx-1">:</span>
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{minutes.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">min</span>
            </div>
            <span className="text-xl font-bold mx-1">:</span>
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{seconds.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">seg</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div className="sticky top-0 w-full text-white py-2 z-10" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <Eye className="h-5 w-5 mr-2" />
        <span className="text-sm">
          {message} {' '}
        </span>
        <div className="flex items-center ml-2">
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{hours.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">horas</span>
          </div>
          <span className="text-xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{minutes.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">min</span>
          </div>
          <span className="text-xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{seconds.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">seg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
