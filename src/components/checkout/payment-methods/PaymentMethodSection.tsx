
import React, { useState, useRef } from 'react';
import { SectionTitle } from '../SectionTitle';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/checkout';
import { CustomerData } from '@/types/checkout';
import { useCustomerDataExtractor } from '@/hooks/useCustomerDataExtractor';
import { PaymentMethodHeader } from './PaymentMethodHeader';
import { PaymentMethodContent } from './PaymentMethodContent';

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
  const { toast } = useToast();

  const { customerData, hasValidCustomerData } = useCustomerDataExtractor(
    customerFormRef, 
    onCustomerDataSubmit
  );

  const handleSubmit = async (data?: any) => {
    setIsProcessing(true);
    setPaymentError(false);
    setPaymentSuccess(false);
    
    try {
      if (!hasValidCustomerData) {
        throw new Error("Por favor, preencha seus dados pessoais corretamente");
      }
      
      await onSubmit(data);
      
      if (paymentMethod === 'pix') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setPaymentError(true);
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar pagamento";
      
      toast({
        title: "Erro de validação",
        description: errorMessage,
        variant: "destructive",
      });
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
        <PaymentMethodHeader paymentMethod={paymentMethod} />
        
        <PaymentMethodContent
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isProcessing}
          buttonColor={buttonColor}
          buttonText={buttonText}
          productPrice={productPrice}
          paymentSuccess={paymentSuccess}
          paymentError={paymentError}
          hasValidCustomerData={hasValidCustomerData}
        />
      </div>
    </section>
  );
};
