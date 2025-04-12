
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
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
          <path d="M9.24 15.5H22.5L18 21H5.76L9.24 15.5Z" fill="#33BC68"/>
          <path d="M15 12H28.5L24 17.5H10.5L15 12Z" fill="#33BC68"/>
          <path d="M20.25 9H33.75L29.25 14.5H15.75L20.25 9Z" fill="#33BC68"/>
          <path d="M9.25 25.5H22.5L18 20H5.75L9.25 25.5Z" fill="#33BC68"/>
        </svg>
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
