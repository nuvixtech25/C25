
import React from 'react';
import { SectionTitle } from './SectionTitle';

interface TestimonialSectionProps {
  headingColor: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ headingColor }) => {
  return (
    <section className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <SectionTitle number={2} title="Testemunhos" />
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              "Comprei sem muitas expectativas, mas fiquei impressionado com a qualidade do conteúdo. 
              O suporte é rápido e eficiente. Recomendo a todos!"
            </p>
            <div className="mt-2 text-xs font-medium text-gray-900">— Maria S.</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              "Melhor investimento que fiz nos últimos tempos. O produto é excelente 
              e atendeu todas as minhas necessidades."
            </p>
            <div className="mt-2 text-xs font-medium text-gray-900">— João P.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
