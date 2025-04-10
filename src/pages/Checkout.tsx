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
import { supabase } from '@/integrations/supabase/client';

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
    // Criar pedido no Supabase
    const order = {
      customer_id: `customer_${Date.now()}`, // No futuro, usar ID real do cliente no Asaas
      customer_name: customer.name,
      customer_email: customer.email,
      customer_cpf_cnpj: customer.cpfCnpj,
      customer_phone: customer.phone,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      status: "PENDING",
      payment_method: paymentMethod,
    };
    
    // Salvar no Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerCpfCnpj: data.customer_cpf_cnpj,
      customerPhone: data.customer_phone,
      productId: data.product_id,
      productName: data.product_name,
      productPrice: data.product_price,
      status: data.status,
      paymentMethod: data.payment_method,
      asaasPaymentId: data.asaas_payment_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  };
  
  const handlePaymentSubmit = async (paymentData?: any) => {
    if (!customerData || !product) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Criar pedido no banco de dados
      const order = await createOrder(customerData, product, paymentMethod);
      
      // 2. Criar billing data para processamento do pagamento
      const billingData: BillingData = {
        customer: customerData,
        value: product.price,
        description: product.name,
        orderId: order.id // Adicionar ID do pedido
      };
      
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
