
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { CountdownBanner } from '@/components/CountdownBanner';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { CheckoutCustomization, Product } from '@/types/checkout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Demo product for preview
const demoProduct: Product = {
  id: 'demo-product',
  name: 'Produto de Demonstração',
  description: 'Este é um produto para visualização do checkout',
  price: 99.90,
  imageUrl: 'https://via.placeholder.com/300x200',
  isDigital: true
};

const CheckoutPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState<CheckoutCustomization>({
    buttonColor: '#6E59A5',
    buttonText: 'Finalizar Compra',
    headingColor: '#6E59A5',
    bannerImageUrl: null,
    topMessage: 'Oferta por tempo limitado!',
    countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isDigitalProduct: true
  });

  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(demoProduct);

  useEffect(() => {
    // Parse customization from URL parameters
    const buttonColor = searchParams.get('buttonColor') || '#6E59A5';
    const buttonText = searchParams.get('buttonText') || 'Finalizar Compra';
    const headingColor = searchParams.get('headingColor') || '#6E59A5';
    const bannerImageUrl = searchParams.get('bannerImageUrl') || null;
    const topMessage = searchParams.get('topMessage') || 'Oferta por tempo limitado!';
    const countdownEndTime = searchParams.get('countdownEndTime') || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const isDigitalProduct = searchParams.get('isDigitalProduct') !== 'false';

    setCustomization({
      buttonColor,
      buttonText,
      headingColor,
      bannerImageUrl,
      topMessage,
      countdownEndTime,
      isDigitalProduct
    });

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Carregando prévia do checkout..." />
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
      
      <CheckoutContent 
        product={demoProduct}
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

export default CheckoutPreview;
