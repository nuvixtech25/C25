
import React from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './card/CardForm';
import { SimplifiedPixOption } from './SimplifiedPixOption';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, QrCode } from 'lucide-react';

interface PaymentMethodSectionProps {
  id: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  isSubmitting: boolean;
  headingColor: string;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  id,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText,
  productPrice = 0
}) => {
  return (
    <section id={id} className="bg-[#242424] border border-gray-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">
        Forma de pagamento
      </h2>
      
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: PaymentMethod) => onPaymentMethodChange(value)}
        className="space-y-3 mb-6"
      >
        <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer ${
          paymentMethod === 'creditCard' ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-[#333333]'
        }`}>
          <RadioGroupItem value="creditCard" id="creditCard" className="text-green-500" />
          <Label htmlFor="creditCard" className="flex items-center cursor-pointer text-white">
            <CreditCard className="h-5 w-5 mr-2 text-gray-300" />
            Cartão de Crédito
          </Label>
        </div>
        
        <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer ${
          paymentMethod === 'pix' ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-[#333333]'
        }`}>
          <RadioGroupItem value="pix" id="pix" className="text-green-500" />
          <Label htmlFor="pix" className="flex items-center cursor-pointer text-white">
            <QrCode className="h-5 w-5 mr-2 text-gray-300" />
            PIX
          </Label>
        </div>
      </RadioGroup>
      
      {paymentMethod === 'creditCard' ? (
        <CardForm 
          onSubmit={onSubmit} 
          isLoading={isSubmitting}
          buttonColor={buttonColor}
          buttonText={buttonText}
          productPrice={productPrice}
        />
      ) : (
        <SimplifiedPixOption
          onSubmit={() => onSubmit()} 
          isLoading={isSubmitting}
          buttonColor={buttonColor}
          buttonText="Pagar com PIX"
        />
      )}
    </section>
  );
};
