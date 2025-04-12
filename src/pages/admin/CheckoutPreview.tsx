
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { usePreviewCustomization } from '@/hooks/usePreviewCustomization';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { PreviewLoading } from '@/components/preview/PreviewLoading';
import { CountdownBanner } from '@/components/CountdownBanner';
import { TopMessageBanner } from '@/components/checkout/TopMessageBanner';
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
    // Set loading to false once customization is loaded
    setLoading(false);
  }, [customization]);

  if (loading) {
    return <PreviewLoading />;
  }

  return (
    <div className="flex flex-col bg-white max-w-full overflow-x-hidden">
      {/* Banners rendered without extra container padding */}
      <div className="w-full">
        {customization.topMessage && customization.countdownEndTime ? (
          <CountdownBanner 
            message={customization.topMessage || 'Preço promocional encerrará em breve'}
            endTime={new Date(customization.countdownEndTime)}
            backgroundColor={customization.bannerColor}
            bannerImageUrl={customization.bannerImageUrl}
          />
        ) : customization.topMessage && (
          <TopMessageBanner 
            message={customization.topMessage || 'Oferta por tempo limitado!'}
            backgroundColor={customization.bannerColor}
            bannerImageUrl={customization.bannerImageUrl}
          />
        )}
      </div>
      
      <div className="w-full flex justify-center mt-4 md:mt-6">
        <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 bg-white">
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
