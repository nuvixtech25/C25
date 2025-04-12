
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckoutContainer } from '@/components/checkout/CheckoutContainer';
import { CountdownBanner } from '@/components/CountdownBanner';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { CheckoutCustomization } from '@/types/checkout';
import { usePreviewCustomization } from '@/hooks/usePreviewCustomization';
import { PreviewContent } from '@/components/preview/PreviewContent';
import { PreviewLoading } from '@/components/preview/PreviewLoading';
import { getDemoProduct } from '@/utils/previewUtils';

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
        />
      )}
      
      <PreviewContent 
        product={demoProduct}
        customerData={customerData || {
          name: '',
          email: '',
          cpfCnpj: '',
          phone: ''
        }} // Provide default empty customer data if null
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
