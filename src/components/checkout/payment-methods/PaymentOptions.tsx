
import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { RadioGroup } from '@/components/ui/radio-group';
import RadioOption from './RadioOption';
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
      className="flex flex-row gap-4 mb-6"
    >
      <RadioOption
        id="creditCard"
        value="creditCard"
        label="Cartão de Crédito"
        Icon={CreditCard}
        iconColor="text-gray-500"
        className="flex-1"
      />
      
      <RadioOption
        id="pix"
        value="pix"
        label="PIX"
        Icon={QrCode}
        iconColor="text-green-500"
        className="flex-1"
      />
    </RadioGroup>
  );
};

export default PaymentOptions;
