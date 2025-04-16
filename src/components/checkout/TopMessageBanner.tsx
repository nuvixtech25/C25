
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface TopMessageBannerProps {
  message: string;
  initialMinutes: number;
  initialSeconds: number;
  bannerImageUrl?: string | null;
  containerClassName?: string;
  bannerColor?: string;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message = "Oferta por tempo limitado!",
  initialMinutes,
  initialSeconds,
  bannerImageUrl,
  containerClassName = "",
  bannerColor = "#000000"
}) => {
  const [hours, setHours] = useState(Math.floor(initialMinutes / 60));
  const [minutes, setMinutes] = useState(initialMinutes % 60);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
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
  }, [hours, minutes, seconds]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Determine background style based on whether we have a banner image URL
  const getBannerStyle = () => {
    if (bannerImageUrl) {
      console.log("Using banner image URL:", bannerImageUrl);
      return { 
        backgroundImage: `url(${bannerImageUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      };
    }
    return { backgroundColor: bannerColor || '#000000' };
  };

  return (
    <div 
      className={`w-full py-2 flex items-center justify-center ${containerClassName}`} 
      style={getBannerStyle()}
    >
      <div className="container mx-auto max-w-2xl flex items-center justify-center">
        <Eye className="text-white h-5 w-5 mr-2" />
        <div className="text-white text-sm md:text-base mr-2">{message}</div>
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(hours)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">HORAS</span>
          </div>
          <span className="text-white text-xl md:text-2xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(minutes)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">MIN</span>
          </div>
          <span className="text-white text-xl md:text-2xl font-bold mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl md:text-2xl font-bold">{formatNumber(seconds)}</span>
            <span className="text-white text-[8px] md:text-xs uppercase">SEG</span>
          </div>
        </div>
      </div>
    </div>
  );
};
