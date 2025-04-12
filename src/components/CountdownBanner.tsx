
import React, { useEffect, useState } from 'react';
import { formatTime } from '@/utils/formatters';
import { Clock } from 'lucide-react';

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
        setTimeLeft({ minutes: 0, seconds: 0 });
        return;
      }
      
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, backgroundColor, bannerImageUrl]);

  if (timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
    return null;
  }

  // Render banner with background image if URL is provided
  if (bannerImageUrl) {
    return (
      <div 
        className="text-white py-3 px-4 text-center mb-6 w-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <Clock className="h-5 w-5 mr-2 text-yellow-300" />
          <span className="text-base md:text-lg">
            {message} <span className="font-bold text-yellow-300">{formatTime(timeLeft.minutes, timeLeft.seconds)}</span>
          </span>
        </div>
      </div>
    );
  }

  // Fallback to color background if no image URL
  return (
    <div className="text-white py-3 px-4 text-center mb-6 w-full" style={{ backgroundColor }}>
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        <Clock className="h-5 w-5 mr-2 text-yellow-300" />
        <span className="text-base md:text-lg">
          {message} <span className="font-bold text-yellow-300">{formatTime(timeLeft.minutes, timeLeft.seconds)}</span>
        </span>
      </div>
    </div>
  );
};
