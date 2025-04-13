
import React, { useState, useEffect, useRef } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { SectionTitle } from '../SectionTitle';
import PaymentOptions from './PaymentOptions';
import { PaymentMethodForms } from './PaymentMethodForms';
import { PaymentStatusMessage } from './PaymentStatusMessage';
import { CreditCard } from 'lucide-react';
import { CustomerData } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

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
  
  // Add state to store customer data
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [hasValidCustomerData, setHasValidCustomerData] = useState(false);
  const lastExtractTimeRef = useRef<number>(0);
  const extractTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to extract and validate customer data from the form
  const extractCustomerData = (): { data: CustomerData | null, isValid: boolean } => {
    if (!customerFormRef.current) return { data: null, isValid: false };
    
    const formData = new FormData(customerFormRef.current);
    const data: CustomerData = {
      name: formData.get('name') as string || '',
      email: formData.get('email') as string || '',
      cpfCnpj: formData.get('cpfCnpj') as string || '',
      phone: formData.get('phone') as string || '',
    };
    
    // Validate all fields are filled and meet minimum requirements
    const isValid = !!(
      data.name && data.name.trim().length > 2 && 
      data.email && data.email.includes('@') && 
      data.cpfCnpj && data.cpfCnpj.replace(/\D/g, '').length >= 11 && 
      data.phone && data.phone.replace(/\D/g, '').length >= 10
    );
    
    return { data, isValid };
  };
  
  // Update customer data when form changes with debouncing
  useEffect(() => {
    if (!customerFormRef.current) return;
    
    const handleFormChange = () => {
      // Clear any existing timeout
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
      
      // Use debouncing to prevent excessive data extraction
      extractTimeoutRef.current = setTimeout(() => {
        const now = Date.now();
        // Only process if it's been at least 1 second since the last extraction
        if (now - lastExtractTimeRef.current > 1000) {
          const { data, isValid } = extractCustomerData();
          
          setHasValidCustomerData(isValid);
          
          if (data) {
            setCustomerData(data);
            // Submit customer data silently in the background
            onCustomerDataSubmit(data);
            lastExtractTimeRef.current = now;
          }
        }
      }, 500);
    };
    
    const form = customerFormRef.current;
    
    // Add listeners to all form inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', handleFormChange);
      input.addEventListener('input', handleFormChange);
    });
    
    // Initial extraction attempt
    handleFormChange();
    
    return () => {
      // Clean up event listeners
      inputs.forEach(input => {
        input.removeEventListener('blur', handleFormChange);
        input.removeEventListener('input', handleFormChange);
      });
      
      // Clear any pending timeout
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
    };
  }, [customerFormRef, onCustomerDataSubmit]);
  
  const handleSubmit = async (data?: any) => {
    setIsProcessing(true);
    setPaymentError(false);
    setPaymentSuccess(false);
    
    try {
      // Get the latest customer data
      const { data: latestCustomerData, isValid } = extractCustomerData();
      
      // Validate customer data before submitting
      if (!isValid || !latestCustomerData) {
        throw new Error("Por favor, preencha seus dados pessoais corretamente");
      }
      
      console.log("Customer data before submission:", latestCustomerData);
      
      // Submit customer data first
      onCustomerDataSubmit(latestCustomerData);
      
      // Then handle the payment with a small delay to ensure customer data is saved
      setTimeout(() => {
        onSubmit(data);
      }, 100);
      
      // Only set success for PIX payments
      // Credit card payments will redirect to success page
      if (paymentMethod === 'pix') {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setPaymentError(true);
      // Show toast error
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
          hasValidCustomerData={hasValidCustomerData}
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
