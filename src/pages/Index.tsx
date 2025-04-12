
import React from 'react';
import { CountdownBanner } from '@/components/CountdownBanner';

const Index = () => {
  const createValidCountdownDate = (): Date => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    return date;
  };

  return (
    <div className="min-h-screen bg-white">
      <CountdownBanner 
        message="Oferta por tempo limitado!"
        endTime={createValidCountdownDate()}
      />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Página Inicial</h1>
        <div className="text-center">
          <a href="/checkout" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Ir para Checkout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
