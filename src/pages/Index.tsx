
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { BillingData, CheckoutCustomization, CustomerData, PaymentMethod, PaymentStatus, Product } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';

// Mock data - In a real app, this would come from Supabase
const mockProduct: Product = {
  id: '1',
  name: 'Assinatura Anual - Cineflick Card',
  description: 'Acesso a todos os benefícios da assinatura premium por 12 meses',
  price: 29.90,
  isDigital: true,
  imageUrl: 'https://via.placeholder.com/60x60?text=Card'
};

// Create a valid Date object for the countdown that's 24 hours from now
const createValidCountdownDate = (): Date => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date;
};

const mockCustomization: CheckoutCustomization = {
  buttonColor: '#28A745', 
  buttonText: 'Finalizar Pagamento',
  headingColor: '#000000',
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: createValidCountdownDate().toISOString(),
  isDigitalProduct: true
};

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  const [product] = useState<Product>(mockProduct);
  const [customization] = useState<CheckoutCustomization>(mockCustomization);
  
  // In a real app, we would fetch the product and customization from Supabase
  useEffect(() => {
    // This would be a fetch from Supabase
    // fetchProductAndCustomization();
  }, []);
  
  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    // Auto-scroll to payment section
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async (paymentData?: any) => {
    setIsSubmitting(true);
    
    try {
      // Create a temporary order to emulate the real flow
      const mockOrderId = `mock_order_${Date.now()}`;
      
      // Create billing data
      const billingData: BillingData = {
        customer: customerData!,
        value: product.price,
        description: product.name,
        orderId: mockOrderId
      };
      
      if (paymentMethod === 'pix') {
        navigate('/payment', { state: { billingData, order: { id: mockOrderId } } });
      } else {
        // Process credit card payment
        toast({
          title: "Pagamento processado",
          description: "Seu pagamento foi processado com sucesso!",
          variant: "default",
        });
        navigate('/success');
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CheckoutContainer>
      <CheckoutContent 
        product={product}
        customerData={customerData}
        paymentMethod={paymentMethod}
        isSubmitting={isSubmitting}
        customization={customization}
        onCustomerSubmit={handleCustomerSubmit}
        onPaymentMethodChange={setPaymentMethod}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </CheckoutContainer>
  );
};

export default Index;
