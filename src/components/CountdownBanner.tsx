
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
