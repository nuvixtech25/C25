
import React, { useState } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './card/CardForm';
import { SimplifiedPixOption } from './SimplifiedPixOption';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, QrCode } from 'lucide-react';
import { SectionTitle } from '../SectionTitle';
import PaymentOptions from './PaymentOptions';
import { Button } from '@/components/ui/button';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const handleSubmit = async (data?: any) => {
    setIsProcessing(true);
    setPaymentError(false);
    setPaymentSuccess(false);
    
    try {
      // Actually call the real submission handler
      onSubmit(data);
      
      if (paymentMethod === 'creditCard') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      setPaymentError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id={id} className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <SectionTitle number={3} title="Pagamento" />
        
        <div className="mt-4">
          <PaymentOptions 
            paymentMethod={paymentMethod} 
            onPaymentMethodChange={onPaymentMethodChange} 
          />
          
          {paymentMethod === 'creditCard' && (
            <CardForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting || isProcessing}
              buttonColor={buttonColor}
              buttonText={buttonText}
              productPrice={productPrice}
            />
          )}
          
          {paymentMethod === 'pix' && (
            <SimplifiedPixOption
              onSubmit={() => handleSubmit()}
              isLoading={isSubmitting || isProcessing}
              buttonColor={buttonColor}
              buttonText="Pagar com PIX"
              showQrCode={paymentSuccess}
            />
          )}
          
          {paymentSuccess && paymentMethod === 'creditCard' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
              Pagamento realizado com sucesso! Verifique seu e-mail.
            </div>
          )}
          
          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              Erro no pagamento. Verifique os dados.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
