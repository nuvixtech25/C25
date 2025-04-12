
import React from 'react';
import { Star } from 'lucide-react';

export const PaymentFooter: React.FC = () => {
  return (
    <>
      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center mb-3">
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
        </div>
        <p className="text-sm text-gray-600">
          "Compra super fácil e rápida! Recomendo!"
        </p>
        <p className="text-xs text-gray-500 mt-1">— Maria S.</p>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500 flex flex-col items-center">
        <p className="mb-2">Se precisar de ajuda, entre em contato com nosso suporte</p>
        <p>© {new Date().getFullYear()} Asaas Payments</p>
      </div>
    </>
  );
};
