
import React from 'react';

interface ShippingMessageProps {
  show: boolean;
}

export const ShippingMessage: React.FC<ShippingMessageProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="py-3 px-4 mb-4 mt-4 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-center animate-fadeIn">
      <span className="font-medium">✅ Frete grátis | Entrega em até 7 dias</span>
    </div>
  );
};
