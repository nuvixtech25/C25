
import { useEffect } from 'react';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { Order, PixPaymentData, PaymentStatus } from '@/types/checkout';

export const usePaymentPixelTracker = (
  order: Order | null,
  paymentData: PixPaymentData | null,
  paymentStatus: PaymentStatus | null
) => {
  const { trackPurchase, trackInitiateCheckout } = usePixelEvents();

  // Track payment initiated (both PIX and card)
  useEffect(() => {
    if (order?.id && paymentData) {
      console.log('[PixelTracker] Tracking payment initiated');
      // Track the start of the payment process
      trackInitiateCheckout(
        paymentData.value || order.productPrice
      );
    }
  }, [order?.id, paymentData, trackInitiateCheckout]);

  // Track payment completed
  useEffect(() => {
    if (order?.id && paymentStatus === 'CONFIRMED') {
      console.log('[PixelTracker] Tracking payment completed');
      // When payment is confirmed, track purchase event across all pixels
      trackPurchase(
        order.id,
        order.productPrice
      );
    }
  }, [order, paymentStatus, trackPurchase]);

  return {
    trackPurchase,
    trackInitiateCheckout
  };
};
