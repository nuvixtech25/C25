
import React from 'react';

interface SectionTitleProps {
  number: number;
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#28A745] text-white font-bold mr-2">
        {number}
      </div>
      <h2 className="text-base font-semibold text-black">{title}</h2>
    </div>
  );
};
