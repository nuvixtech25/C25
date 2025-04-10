
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { handleApiError } from '@/utils/errorHandling';
import { getAsaasConfig } from '@/services/asaasConfigService';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData } = useCheckoutOrder();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async () => {
    if (!customerData || !product) return;
    
    setIsSubmitting(true);
    
    try {
      const order = await createOrder(customerData, product, paymentMethod);
      
      const billingData = prepareBillingData(customerData, product, order.id as string);
      
      if (paymentMethod === 'pix') {
        navigate('/payment', { 
          state: { 
            billingData, 
            order 
          } 
        });
      } else {
        // Handle credit card payment with manual redirect
        const config = await getAsaasConfig();
        const redirectPage = config?.manual_card_redirect_page || '/payment-pending';
        
        toast({
          title: "Pagamento com cartão processado",
          description: "Redirecionando para a página configurada.",
        });
        
        navigate(redirectPage, { 
          state: { 
            order,
            billingData
          } 
        });
      }
    } catch (error) {
      handleApiError(error, {
        toast,
        defaultMessage: "Ocorreu um erro ao processar o pagamento. Tente novamente."
      });
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
