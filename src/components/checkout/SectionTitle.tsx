
import React from 'react';

interface SectionTitleProps {
  number: number;
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-semibold">
        {number}
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
};
