
import React from 'react';
import { CreditCard } from 'lucide-react';
import { RadioGroup } from '@/components/ui/radio-group';
import { PaymentMethod } from '@/types/checkout';

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  paymentMethod, 
  onPaymentMethodChange 
}) => {
  return (
    <RadioGroup
      value={paymentMethod}
      onValueChange={(value: PaymentMethod) => onPaymentMethodChange(value)}
      className="flex flex-row gap-2 mb-6"
    >
      <div
        className={`flex-1 cursor-pointer p-4 flex justify-center items-center border ${
          paymentMethod === 'creditCard' 
            ? 'bg-gray-100 border-gray-300' 
            : 'bg-white border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('creditCard')}
      >
        <CreditCard className="text-gray-600" size={24} />
      </div>
      
      <div
        className={`flex-1 cursor-pointer p-4 flex justify-center items-center border ${
          paymentMethod === 'pix' 
            ? 'bg-white border-green-500' 
            : 'bg-white border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('pix')}
      >
        <img 
          src="https://pay.kirvano.com/img/pix.svg" 
          alt="PIX" 
          className="h-8 w-8"
        />
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;

