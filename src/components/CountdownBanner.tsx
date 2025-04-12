
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { Eye } from 'lucide-react';

interface CountdownBannerProps {
  message: string;
  endTime: Date;
  backgroundColor?: string;
  bannerImageUrl?: string | null;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ 
  message, 
  endTime, 
  backgroundColor = '#000000',
  bannerImageUrl = null
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    console.log('CountdownBanner rendered with backgroundColor:', backgroundColor);
    console.log('CountdownBanner rendered with bannerImageUrl:', bannerImageUrl);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, backgroundColor, bannerImageUrl]);

  if (timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
    return null;
  }

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className="text-white py-2 px-4 w-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Eye className="h-5 w-5 mr-2" />
          <span className="text-sm">
            {message} {' '}
          </span>
          <div className="flex items-center ml-2">
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">horas</span>
            </div>
            <span className="text-xl font-bold mx-1">:</span>
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">min</span>
            </div>
            <span className="text-xl font-bold mx-1">:</span>
            <div className="flex flex-col items-center mx-1">
              <span className="font-bold text-xl">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase">seg</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div className="text-white py-2 px-4 w-full" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <Eye className="h-5 w-5 mr-2" />
        <span className="text-sm">
          {message} {' '}
        </span>
        <div className="flex items-center ml-2">
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">horas</span>
          </div>
          <span className="text-xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">min</span>
          </div>
          <span className="text-xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center mx-1">
            <span className="font-bold text-xl">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-xs uppercase">seg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
