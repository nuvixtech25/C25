
import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodHeaderProps {
  paymentMethod: 'creditCard' | 'pix';
}

export const PaymentMethodHeader: React.FC<PaymentMethodHeaderProps> = ({ paymentMethod }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div></div>
      <div className="text-sm font-medium text-gray-600">
        {paymentMethod === 'creditCard' ? 'Cartão de crédito' : 'PIX'}
      </div>
    </div>
  );
};
