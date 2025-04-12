
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { usePreviewCustomization } from '@/hooks/usePreviewCustomization';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { PreviewLoading } from '@/components/preview/PreviewLoading';
import { CountdownBanner } from '@/components/CountdownBanner';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';

const CheckoutPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { customization, demoProduct } = usePreviewCustomization(searchParams);

  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(demoProduct);

  useEffect(() => {
    // Log customization to verify banner color
    console.log('CheckoutPreview customization:', customization);
    // Set loading to false once customization is loaded
    setLoading(false);
  }, [customization]);

  if (loading) {
    return <PreviewLoading />;
  }

  return (
    <CheckoutContainer>
      {customization.topMessage && customization.countdownEndTime && (
        <CountdownBanner 
          message={customization.topMessage}
          endTime={new Date(customization.countdownEndTime)}
          backgroundColor={customization.bannerColor}
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
