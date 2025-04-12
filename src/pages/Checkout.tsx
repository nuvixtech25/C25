
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '@/services/productService';
import { CountdownBanner } from '@/components/CountdownBanner';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { CheckoutError } from '@/components/checkout/CheckoutError';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePixelEvents } from '@/hooks/usePixelEvents';

const Checkout = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { trackPurchase } = usePixelEvents();
  
  // Fetch product data by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug || ''),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Get checkout customization based on product - filter out null values
  const customization = useCheckoutCustomization(product || undefined);
  
  // Use checkout state hook
  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product || undefined);

  // If the product is not found, redirect to the 404 page
  useEffect(() => {
    if (!isLoading && !product && !error) {
      navigate('/not-found', { replace: true });
    }
  }, [product, isLoading, error, navigate]);
  
  // Show loading state while fetching product
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Carregando produto..." />
      </div>
    );
  }
  
  // If there's an error or product is not found but haven't redirected yet
  if (error || !product) {
    return <CheckoutError />;
  }
  
  return (
    <CheckoutContainer>
      {customization.topMessage && customization.countdownEndTime && (
        <CountdownBanner 
          message={customization.topMessage}
          endTime={new Date(customization.countdownEndTime)}
        />
      )}
      
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

export default Checkout;
