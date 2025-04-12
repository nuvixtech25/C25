
import React from 'react';
import { Testimonial } from '@/types/checkout';
import { SectionTitle } from './SectionTitle';
import { Check } from 'lucide-react';

// Mock testimonials data - In a real app, this would come from Supabase
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Reinaldo Martins da Silva',
    photo: 'https://randomuser.me/api/portraits/men/42.jpg',
    rating: 5,
    comment: 'Estou muito satisfeito com o serviço, realmente entregam o que prometem!'
  },
  {
    id: '2',
    name: 'Amanda Oliveira Santos',
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    rating: 5,
    comment: 'Ótimo produto! Recomendo para todos que precisam de um serviço como este. Fácil de usar e muito completo.'
  },
  {
    id: '3',
    name: 'Carlos Eduardo Ferreira',
    photo: 'https://randomuser.me/api/portraits/men/24.jpg',
    rating: 5,
    comment: 'Já utilizei várias vezes e nunca tive problemas. O suporte responde rapidamente quando precisei.'
  }
];

interface TestimonialSectionProps {
  headingColor: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ headingColor }) => {
  return (
    <section id="testimonials-section" className="mb-8">
      <div className="flex items-center mb-4">
        <SectionTitle number={2} title="Depoimentos" />
        <p className="text-sm text-[#666666] ml-2">3 comentários</p>
      </div>
      
      <div className="space-y-4 mb-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border border-[#E0E0E0] rounded p-3 bg-white">
            <div className="flex items-center mb-2">
              <img 
                src={testimonial.photo} 
                alt={testimonial.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-bold text-sm">{testimonial.name}</h4>
                <div className="flex">
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
            <p className="text-sm text-black">{testimonial.comment}</p>
            <div className="mt-2 text-xs text-[#666666]">
              <button className="flex items-center gap-1 hover:text-[#28A745]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Foi útil?
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[#E6F4EA] border border-[#28A745] rounded-md p-4 mb-6">
        <div className="flex items-start">
          <Check className="w-5 h-5 text-[#28A745] flex-shrink-0 mt-0.5 mr-2" />
          <p className="text-sm">
            Entrega via Email: Você receberá os dados de acesso em seu email cadastrado imediatamente após a confirmação do pagamento.
          </p>
        </div>
      </div>
    </section>
  );
};
