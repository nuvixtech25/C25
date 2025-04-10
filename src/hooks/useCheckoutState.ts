
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { handleApiError } from '@/utils/errorHandling';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  // Use checkout order hook
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData } = useCheckoutOrder();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    // Auto-scroll to payment section
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async () => {
    if (!customerData || !product) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Criar pedido no banco de dados
      const order = await createOrder(customerData, product, paymentMethod);
      
      // 2. Criar billing data para processamento do pagamento
      const billingData = prepareBillingData(customerData, product, order.id as string);
      
      // 3. Processar pagamento baseado no método selecionado
      if (paymentMethod === 'pix') {
        // Redirecionar para página de pagamento PIX com billing data e order
        navigate('/payment', { 
          state: { 
            billingData, 
            order 
          } 
        });
      } else {
        // Processar pagamento de cartão
        // Em uma aplicação real, isso integraria com a API do Asaas
        // Por enquanto, simularemos um pagamento bem-sucedido
        
        toast({
          title: "Pagamento processado",
          description: "Seu pagamento com cartão foi processado com sucesso!",
        });
        
        navigate('/success');
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
