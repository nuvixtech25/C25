
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { BillingData, CheckoutCustomization, CustomerData, Order, PaymentMethod, Product } from '@/types/checkout';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
import { TestimonialSection } from '@/components/checkout/TestimonialSection';
import { PaymentMethodSection } from '@/components/checkout/PaymentMethodSection';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CountdownBanner } from '@/components/CountdownBanner';
import { fetchProductBySlug } from '@/services/productService';
import { Loader2 } from 'lucide-react';

// Mock customization data - In a real app, this would come from Supabase
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
  const { slug } = useParams<{ slug: string }>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  const [customization] = useState<CheckoutCustomization>(mockCustomization);
  
  // Fetch product data by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug || ''),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // If the product is not found, redirect to the 404 page
  React.useEffect(() => {
    if (!isLoading && !product && !error) {
      navigate('/not-found', { replace: true });
    }
  }, [product, isLoading, error, navigate]);
  
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
    if (!customerData || !product) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Create order in the database
      const order = await createOrder(customerData, product, paymentMethod);
      
      // 2. Create billing data for payment processing
      const billingData: BillingData = {
        customer: customerData,
        value: product.price,
        description: product.name,
      };
      
      // 3. Process payment based on the selected method
      if (paymentMethod === 'pix') {
        // Redirect to PIX payment page with billing data and order
        navigate('/payment', { 
          state: { 
            billingData, 
            order 
          } 
        });
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

  // Show loading state while fetching product
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando produto...</span>
      </div>
    );
  }
  
  // If there's an error or product is not found but haven't redirected yet
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar o produto.</p>
      </div>
    );
  }

  // Update customization based on product type
  const productCustomization = {
    ...customization,
    isDigitalProduct: product.isDigital
  };
  
  return (
    <CheckoutContainer>
      {productCustomization.topMessage && productCustomization.countdownEndTime && (
        <CountdownBanner 
          message={productCustomization.topMessage}
          endTime={new Date(productCustomization.countdownEndTime)}
        />
      )}
      
      <div className="grid md:grid-cols-12 gap-6 mt-6">
        <div className="md:col-span-7 space-y-8">
          <PersonalInfoSection 
            onSubmit={handleCustomerSubmit} 
            headingColor={productCustomization.headingColor}
          />
          
          <TestimonialSection headingColor={productCustomization.headingColor} />
          
          {customerData && (
            <PaymentMethodSection
              id="payment-section"
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handlePaymentSubmit}
              isSubmitting={isSubmitting}
              headingColor={productCustomization.headingColor}
              buttonColor={productCustomization.buttonColor}
              buttonText={paymentMethod === 'pix' ? 'Pagar com PIX' : productCustomization.buttonText}
            />
          )}
        </div>
        
        <div className="md:col-span-5">
          <div className="sticky top-4">
            <OrderSummary 
              product={product}
              isDigitalProduct={productCustomization.isDigitalProduct}
            />
          </div>
        </div>
      </div>
    </CheckoutContainer>
  );
};

export default Checkout;
