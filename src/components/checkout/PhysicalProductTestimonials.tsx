
import React, { useState } from 'react';
import { Testimonial } from '@/types/checkout';
import { SectionTitle } from './SectionTitle';
import { Check, ThumbsDown, ThumbsUp, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Testimonials data for physical products
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos M.',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    comment: 'Rápido, direto e sem enrolação. Recomendo para todos que querem um checkout eficiente.',
    timeAgo: '10 minutos atrás'
  },
  {
    id: '2',
    name: 'Mariana S.',
    photo: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 5,
    comment: 'Comprei sem problemas e recebi tudo certinho. Entrega super rápida!',
    timeAgo: 'há cerca de 1 hora'
  },
  {
    id: '3',
    name: 'Felipe T.',
    photo: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 5,
    comment: 'Pedi para meus pais e chegou em 4 dias. Excelente serviço, embalagem perfeita.',
    timeAgo: 'há 2 dias'
  }
];

interface PhysicalProductTestimonialsProps {
  headingColor: string;
}

export const PhysicalProductTestimonials: React.FC<PhysicalProductTestimonialsProps> = ({ headingColor }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials-section" className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle 
            title="O que nossos clientes estão dizendo" 
            showNumberBadge={false}
            headingColor={headingColor}
          />
          <span className="text-sm text-gray-500">{testimonials.length} comentários</span>
        </div>
        
        <div className="border border-[#E0E0E0] rounded-lg p-4 bg-white">
          {/* Current testimonial display */}
          <div className="mb-6">
            <div className="flex items-start">
              <img 
                src={testimonials[activeIndex].photo} 
                alt={testimonials[activeIndex].name} 
                className="w-12 h-12 rounded-full object-cover mr-3 flex-shrink-0" 
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm">{testimonials[activeIndex].name}</h4>
                    <div className="flex my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className="w-4 h-4 text-[#FFD700]" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-800 italic my-2">"{testimonials[activeIndex].comment}"</p>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{testimonials[activeIndex].timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial navigation dots */}
          <div className="flex justify-center gap-1 my-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Shipping information */}
          <div className="bg-[#E6F4EA] border border-[#28A745] rounded-md p-3 mt-4 flex items-center">
            <Check className="w-5 h-5 text-[#28A745] flex-shrink-0 mr-2" />
            <p className="text-sm">
              Entrega para todo Brasil: Seu pedido será processado e enviado em até 24 horas após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
