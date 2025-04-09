
import React from 'react';
import { Testimonial } from '@/types/checkout';
import { Card, CardContent } from '@/components/ui/card';

// Mock testimonials data - In a real app, this would come from Supabase
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana Silva',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
    comment: 'Excelente curso! O conteúdo é muito bem explicado e aplicável imediatamente. Superei minhas expectativas!'
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    comment: 'Incrível a qualidade do material. Em apenas uma semana já consegui aplicar vários conhecimentos no meu negócio.'
  },
  {
    id: '3',
    name: 'Mariana Costa',
    photo: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 4,
    comment: 'Material muito completo e equipe sempre disponível para tirar dúvidas. Vale muito a pena o investimento!'
  }
];

interface TestimonialSectionProps {
  headingColor: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ headingColor }) => {
  return (
    <section id="testimonials-section" className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: headingColor }}>
        O que dizem nossos clientes
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <img 
                  src={testimonial.photo} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{testimonial.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
