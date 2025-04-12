
import React from 'react';
import { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SectionTitleProps {
  number?: number;
  title: string;
  color?: string;
  icon?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  number, 
  title, 
  color = '#000000',
  icon
}) => {
  // Dynamically get the icon component if provided
  const IconComponent = icon ? (LucideIcons as Record<string, LucideIcon>)[icon] : null;

  return (
    <div className="flex items-center mb-4">
      {number !== undefined && (
        <div 
          className="flex items-center justify-center w-7 h-7 rounded-full text-white font-bold mr-2"
          style={{ backgroundColor: '#28A745' }}
        >
          {number}
        </div>
      )}
      {IconComponent && (
        <span className="mr-2">
          <IconComponent size={20} color={color} />
        </span>
      )}
      <h2 
        className="text-base font-semibold" 
        style={{ color }}
      >
        {title}
      </h2>
    </div>
  );
};
