
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BillingData, CheckoutCustomization, CustomerData, Order, PaymentMethod, Product } from '@/types/checkout';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
import { TestimonialSection } from '@/components/checkout/TestimonialSection';
import { PaymentMethodSection } from '@/components/checkout/PaymentMethodSection';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CountdownBanner } from '@/components/CountdownBanner';

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

const Checkout = () => {
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
  
  const createOrder = async (customer: CustomerData, product: Product, paymentMethod: PaymentMethod): Promise<Order> => {
    // In a real app, this would create a record in Supabase
    // For this example, we'll create a mock order
    
    const order: Order = {
      id: `order_${Date.now()}`,
      customerId: `customer_${Date.now()}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCpfCnpj: customer.cpfCnpj,
      customerPhone: customer.phone,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      status: "PENDING",
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, we would save this to Supabase
    /*
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
    */
    
    return order;
  };
  
  const handlePaymentSubmit = async (paymentData?: any) => {
    if (!customerData) return;
    
    setIsSubmitting(true);
    
    try {
      // Create order in the database
      const order = await createOrder(customerData, product, paymentMethod);
      
      // Create billing data for payment processing
      const billingData: BillingData = {
        customer: customerData,
        value: product.price,
        description: product.name,
      };
      
      if (paymentMethod === 'pix') {
        // Redirect to PIX payment page with billing data and order
        navigate('/payment', { state: { billingData, order } });
      } else {
        // Process credit card payment
        // In a real app, this would integrate with Asaas API
        // For now, we'll just simulate a successful payment
        
        toast({
          title: "Pagamento processado",
          description: "Seu pagamento com cartão foi processado com sucesso!",
        });
        
        // In a real app, we would update the order status
        /*
        await supabase
          .from('orders')
          .update({ status: "CONFIRMED" })
          .eq('id', order.id);
        */
        
        navigate('/success');
      }
    } catch (error) {
      console.error("Error processing payment:", error);
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
          
          <TestimonialSection headingColor={customization.headingColor} />
          
          {customerData && (
            <PaymentMethodSection
              id="payment-section"
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handlePaymentSubmit}
              isSubmitting={isSubmitting}
              headingColor={customization.headingColor}
              buttonColor={customization.buttonColor}
              buttonText={paymentMethod === 'pix' ? 'Pagar com PIX' : customization.buttonText}
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

export default Checkout;
