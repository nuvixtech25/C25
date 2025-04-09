
import React, { useState, useEffect } from 'react';
import { CheckoutLayout } from '@/components/CheckoutLayout';
import { CustomerForm } from '@/components/CustomerForm';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { CreditCardForm } from '@/components/CreditCardForm';
import { OrderSummary } from '@/components/OrderSummary';
import { CountdownBanner } from '@/components/CountdownBanner';
import { useToast } from '@/hooks/use-toast';
import { BillingData, CheckoutCustomization, PaymentMethod, Product } from '@/types/checkout';
import { useNavigate } from 'react-router-dom';

// Mock data - In a real app, this would come from Supabase
const mockProduct: Product = {
  id: '1',
  name: 'Curso de Marketing Digital',
  description: 'Curso completo de marketing digital para iniciantes e profissionais',
  price: 79.90,
  isDigital: true,
  imageUrl: 'https://via.placeholder.com/300x200'
};

const mockCustomization: CheckoutCustomization = {
  buttonColor: '#6E59A5', // Default Asaas primary color
  buttonText: 'Finalizar Compra',
  headingColor: '#6E59A5',
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
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
  
  const handlePaymentSubmit = (paymentData: any) => {
    setIsSubmitting(true);
    
    // Create billing data
    const billingData: BillingData = {
      customer: customerData!,
      value: product.price,
      description: product.name,
    };
    
    // In a real app, this would submit to Asaas API or Supabase
    setTimeout(() => {
      if (paymentMethod === 'pix') {
        navigate('/payment', { state: { billingData } });
      } else {
        // Process credit card payment
        toast({
          title: "Pagamento processado",
          description: "Seu pagamento foi processado com sucesso!",
          variant: "success",
        });
        navigate('/success');
      }
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <CheckoutLayout>
      {customization.topMessage && customization.countdownEndTime && (
        <CountdownBanner 
          message={customization.topMessage}
          endTime={new Date(customization.countdownEndTime)}
        />
      )}
      
      <div className="grid md:grid-cols-12 gap-6 mt-6">
        <div className="md:col-span-7 space-y-8">
          <section id="customer-section" className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: customization.headingColor }}>
              Informações pessoais
            </h2>
            <CustomerForm onSubmit={handleCustomerSubmit} />
          </section>
          
          <section id="testimonials-section" className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: customization.headingColor }}>
              O que dizem nossos clientes
            </h2>
            <TestimonialsSection />
          </section>
          
          {customerData && (
            <section id="payment-section" className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: customization.headingColor }}>
                Forma de pagamento
              </h2>
              <PaymentMethodSelector 
                selectedMethod={paymentMethod} 
                onChange={setPaymentMethod} 
              />
              
              {paymentMethod === 'creditCard' ? (
                <CreditCardForm 
                  onSubmit={handlePaymentSubmit} 
                  isLoading={isSubmitting}
                  buttonColor={customization.buttonColor}
                  buttonText={customization.buttonText}
                />
              ) : (
                <div className="mt-6">
                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
                    style={{ backgroundColor: customization.buttonColor }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processando...' : 'Pagar com PIX'}
                  </button>
                </div>
              )}
            </section>
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
    </CheckoutLayout>
  );
};

export default Index;
