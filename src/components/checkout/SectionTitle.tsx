
import React from 'react';
import { CreditCard } from 'lucide-react';

interface SectionTitleProps {
  number?: number;
  title: string;
  icon?: React.ReactNode;
  showNumberBadge?: boolean;
  headingColor?: string; // Added headingColor prop
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  number, 
  title, 
  icon, 
  showNumberBadge = true,
  headingColor
}) => {
  return (
    <div className="flex items-center mb-4">
      {showNumberBadge && number ? (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#28A745] text-white font-bold mr-2">
          {number}
        </div>
      ) : icon ? (
        <div className="mr-2">{icon}</div>
      ) : null}
      <h2 
        className="text-base font-semibold"
        style={{ color: headingColor || 'black' }}
      >
        {title}
      </h2>
    </div>
  );
};
