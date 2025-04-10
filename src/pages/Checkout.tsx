
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod } from '@/types/checkout';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CountdownBanner } from '@/components/CountdownBanner';
import { fetchProductBySlug } from '@/services/productService';
import { Loader2 } from 'lucide-react';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { CheckoutFormContainer } from '@/components/checkout/CheckoutFormContainer';
import { handleApiError } from '@/utils/errorHandling';

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  // Fetch product data by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug || ''),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get checkout customization based on product
  const customization = useCheckoutCustomization(product);
  
  // Use checkout order hook
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData } = useCheckoutOrder();

  // If the product is not found, redirect to the 404 page
  useEffect(() => {
    if (!isLoading && !product && !error) {
      navigate('/not-found', { replace: true });
    }
  }, [product, isLoading, error, navigate]);
  
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
  
  return (
    <CheckoutContainer>
      {customization.topMessage && customization.countdownEndTime && (
        <CountdownBanner 
          message={customization.topMessage}
          endTime={new Date(customization.countdownEndTime)}
        />
      )}
      
      <div className="grid md:grid-cols-12 gap-6 mt-6">
        <div className="md:col-span-7">
          <CheckoutFormContainer
            customerData={customerData}
            paymentMethod={paymentMethod}
            isSubmitting={isSubmitting}
            headingColor={customization.headingColor}
            buttonColor={customization.buttonColor}
            buttonText={customization.buttonText}
            onCustomerSubmit={handleCustomerSubmit}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentSubmit={handlePaymentSubmit}
          />
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
