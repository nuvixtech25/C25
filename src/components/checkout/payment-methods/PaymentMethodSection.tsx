
import React, { useState, useRef } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { SectionTitle } from '../SectionTitle';
import PaymentOptions from './PaymentOptions';
import { PaymentMethodForms } from './PaymentMethodForms';
import { PaymentStatusMessage } from './PaymentStatusMessage';
import { CreditCard } from 'lucide-react';
import { CustomerData } from '@/types/checkout';

interface PaymentMethodSectionProps {
  id: string;
  paymentMethod: PaymentMethod;
  customerFormRef: React.RefObject<HTMLFormElement>;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  onCustomerDataSubmit: (data: CustomerData) => void;
  isSubmitting: boolean;
  headingColor: string;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  id,
  paymentMethod,
  customerFormRef,
  onPaymentMethodChange,
  onSubmit,
  onCustomerDataSubmit,
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
      // Trigger the customer form submission first
      if (customerFormRef.current) {
        const isValid = await customerFormRef.current.requestSubmit();
      }
      
      // Then handle the payment
      onSubmit(data);
      
      // Only set success for PIX payments
      // Credit card payments will redirect to success page
      if (paymentMethod === 'pix') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      setPaymentError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id={id} className="mb-4 bg-white rounded-lg border border-[#E0E0E0] p-6">
      <SectionTitle 
        title="Pagamento" 
        showNumberBadge={false} 
        icon={<CreditCard className="text-gray-700" size={20} />} 
      />
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="text-sm font-medium text-gray-600">
            {paymentMethod === 'creditCard' ? 'Cartão de crédito' : 'PIX'}
          </div>
        </div>
        
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
    </section>
  );
};
