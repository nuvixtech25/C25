
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
        <img src="/pix-icon.svg" alt="PIX" className="h-6" onError={(e) => {
          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNTIgMTFIMTVMMTIuNDYgMTRINEw2LjUyIDExWiIgZmlsbD0iIzMzQkM2OCIvPgo8cGF0aCBkPSJNMTAgOUgxOEwxNS41IDEySDcuNUwxMCA5WiIgZmlsbD0iIzMzQkM2OCIvPgo8cGF0aCBkPSJNMTMuNSA2SDIxLjVMMTkgOUgxMUwxMy41IDZaIiBmaWxsPSIjMzNCQzY4Ii8+CjxwYXRoIGQ9Ik02LjUgMTdIMTQuNUwxMiAxNEg0TDYuNSAxN1oiIGZpbGw9IiMzM0JDNjgiLz4KPC9zdmc+Cg==";
        }} />
      </div>
    </RadioGroup>
  );
};

export default PaymentOptions;
