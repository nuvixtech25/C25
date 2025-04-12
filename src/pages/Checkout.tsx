
import React from 'react';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { CountdownBanner } from '@/components/CountdownBanner';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';

const Checkout = () => {
  const customization = useCheckoutCustomization();

  // Create a countdown time (15 minutes from now)
  const createCountdownTime = () => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 15);
    return time;
  };

  return (
    <CheckoutContainer>
      <CountdownBanner 
        message={customization.topMessage}
        endTime={createCountdownTime()}
      />
      {/* Add your checkout content here */}
    </CheckoutContainer>
  );
};

export default Checkout;
