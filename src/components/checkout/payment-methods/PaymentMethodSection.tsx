
import React from 'react';
import { PaymentMethod } from '@/types/checkout';
import { PaymentOptions } from './PaymentOptions';
import { CardForm } from './card';
import { SimplifiedPixOption } from './SimplifiedPixOption';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/checkout/SectionTitle';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface PaymentMethodSectionProps {
  id?: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  isSubmitting: boolean;
  headingColor?: string;
  buttonColor?: string;
  buttonText?: string;
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
  buttonText = 'Finalizar Compra',
  productPrice
}) => {
  return (
    <section id={id} className="bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <SectionTitle number={3} title="Meio de Pagamento" />
        
        <PaymentOptions
          selectedMethod={paymentMethod}
          onSelect={onPaymentMethodChange}
        />
        
        <Separator className="my-4" />
        
        {paymentMethod === 'creditCard' ? (
          <CardForm onSubmit={onSubmit} isSubmitting={isSubmitting} productPrice={productPrice} />
        ) : (
          <SimplifiedPixOption
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            buttonText={buttonText || 'Pagar com PIX'}
            buttonColor={buttonColor}
          />
        )}
      </div>
    </section>
  );
};
