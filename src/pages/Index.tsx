
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CountdownBanner } from '@/components/CountdownBanner';

const Index: React.FC = () => {
  // Create a countdown end time 15 minutes from now
  const countdownEndTime = new Date();
  countdownEndTime.setMinutes(countdownEndTime.getMinutes() + 15);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <CountdownBanner 
        message="Oferta por tempo limitado!"
        endTime={countdownEndTime}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Página Inicial</h1>
        <Link to="/checkout">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            Ir para Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
