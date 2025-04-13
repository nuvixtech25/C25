
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product, CreditCardData } from '@/types/checkout';
import { useRedirectConfig } from './checkout/useRedirectConfig';
import { usePaymentNavigation } from './checkout/usePaymentNavigation';
import { useOrderHandler } from './checkout/useOrderHandler';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  const { redirectPage } = useRedirectConfig();
  const { navigateToPayment, navigateToFailure } = usePaymentNavigation();
  const { handleOrderCreation, isSubmitting, setIsSubmitting } = useOrderHandler();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    console.log('Customer data submitted:', data);
    
    // Validate customer data
    if (!data.name || !data.email || !data.cpfCnpj || !data.phone) {
      console.error('Missing required customer data fields');
      return;
    }
    
    // Store customer data in state for later use
    setCustomerData(data);
  };
  
  const handlePaymentSubmit = async (paymentData?: CreditCardData, existingOrderId?: string) => {
    if (!product) {
      console.error('Missing product data');
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we have customer data in state before proceeding
    if (!customerData || !customerData.name || !customerData.email || !customerData.cpfCnpj || !customerData.phone) {
      console.error('Missing customer data');
      toast({
        title: "Erro",
        description: "Por favor, preencha seus dados pessoais",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Processing payment with customer data:", customerData);
    setIsSubmitting(true);
    
    // Define order variable outside the try block so it's accessible in catch
    let currentOrder: any = null;
    let billingData: any = null;
    
    try {
      const result = await handleOrderCreation(
        customerData, 
        product, 
        paymentMethod, 
        paymentData, 
        existingOrderId
      );
      
      currentOrder = result.currentOrder;
      billingData = result.billingData;
      
      navigateToPayment(
        paymentMethod, 
        currentOrder, 
        billingData, 
        redirectPage, 
        customerData, 
        product
      );
    } catch (error) {
      navigateToFailure(error, customerData, currentOrder);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  };
};
