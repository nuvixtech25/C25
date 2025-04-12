
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

  // Update customization to use new image
  const updatedCustomization = {
    ...customization,
    topMessage: 'Fique de olho, a oferta termina em:',
    bannerImageUrl: '/lovable-uploads/9bc6da91-7e27-4e9a-832c-ea9b7ff6b3d2.png'
  };

  return (
    <div className="flex flex-col bg-white max-w-full overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 bg-white">
          {/* Banners rendered inside the container that has the same width as the form */}
          {updatedCustomization.topMessage && updatedCustomization.countdownEndTime ? (
            <CountdownBanner 
              message={updatedCustomization.topMessage || 'Fique de olho, a oferta termina em:'}
              endTime={new Date(updatedCustomization.countdownEndTime)}
              backgroundColor={updatedCustomization.bannerColor}
              bannerImageUrl={updatedCustomization.bannerImageUrl}
              containerClassName="w-full"
            />
          ) : updatedCustomization.topMessage && (
            <TopMessageBanner 
              message={updatedCustomization.topMessage || 'Fique de olho, a oferta termina em:'}
              backgroundColor={updatedCustomization.bannerColor}
              bannerImageUrl={updatedCustomization.bannerImageUrl}
              initialMinutes={5}
              initialSeconds={0}
              containerClassName="w-full"
            />
          )}
          
          <CheckoutContent 
            product={demoProduct}
            customerData={customerData}
            paymentMethod={paymentMethod}
            isSubmitting={isSubmitting}
            customization={updatedCustomization}
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
