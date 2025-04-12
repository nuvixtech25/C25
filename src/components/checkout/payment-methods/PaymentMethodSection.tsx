
import React, { useState } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { SectionTitle } from '../SectionTitle';
import PaymentOptions from './PaymentOptions';
import { PaymentMethodForms } from './PaymentMethodForms';
import { PaymentStatusMessage } from './PaymentStatusMessage';

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
          
          <PaymentMethodForms
            paymentMethod={paymentMethod}
            onSubmit={handleSubmit}
            isLoading={isSubmitting || isProcessing}
            buttonColor={buttonColor}
            buttonText={buttonText}
            productPrice={productPrice}
            showQrCode={paymentSuccess}
          />
          
          <PaymentStatusMessage
            success={paymentSuccess}
            error={paymentError}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </section>
  );
};
