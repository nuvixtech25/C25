
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
import { TestimonialSection } from '@/components/checkout/TestimonialSection';
import { PaymentMethodSection } from '@/components/checkout/PaymentMethodSection';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CountdownBanner } from '@/components/CountdownBanner';
import { BillingData, CheckoutCustomization, CustomerData, PaymentMethod, PaymentStatus, Product } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';

// Mock data - In a real app, this would come from Supabase
const mockProduct: Product = {
  id: '1',
  name: 'Curso de Marketing Digital',
  description: 'Curso completo de marketing digital para iniciantes e profissionais',
  price: 79.90,
  isDigital: true,
  imageUrl: 'https://via.placeholder.com/300x200'
};

// Create a valid Date object for the countdown that's 24 hours from now
const createValidCountdownDate = (): Date => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date;
};

const mockCustomization: CheckoutCustomization = {
  buttonColor: '#6E59A5', // Default Asaas primary color
  buttonText: 'Finalizar Compra',
  headingColor: '#6E59A5',
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: createValidCountdownDate().toISOString(), // 24h from now, using a valid date
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
      {customization.topMessage && customization.countdownEndTime && (
        <CountdownBanner 
          message={customization.topMessage}
          endTime={new Date(customization.countdownEndTime)}
        />
      )}
      
      <div className="grid md:grid-cols-12 gap-6 mt-6">
        <div className="md:col-span-7 space-y-8">
          <PersonalInfoSection 
            onSubmit={handleCustomerSubmit}
            headingColor={customization.headingColor}
          />
          
          <TestimonialSection
            headingColor={customization.headingColor}
          />
          
          {customerData && (
            <PaymentMethodSection
              id="payment-section"
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handlePaymentSubmit}
              isSubmitting={isSubmitting}
              headingColor={customization.headingColor}
              buttonColor={customization.buttonColor}
              buttonText={customization.buttonText}
              productPrice={product.price}
            />
          )}
        </div>
        
        <div className="md:col-span-5">
          <div className="sticky top-4">
            <OrderSummary 
              product={product}
              isDigitalProduct={customization.isDigitalProduct}
            />
          </div>
        </div>
      </div>
    </CheckoutContainer>
  );
};

export default Index;
