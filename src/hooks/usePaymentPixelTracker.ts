
import { useEffect } from 'react';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { Order, PixPaymentData, PaymentStatus } from '@/types/checkout';

/**
 * Hook for tracking payment events for analytics pixels
 */
export const usePaymentPixelTracker = (
  order: Order | null,
  paymentData: PixPaymentData | null,
  paymentStatus: PaymentStatus | null
) => {
  const { trackInitiateCheckout, trackPaymentInitiated, trackPaymentComplete } = usePixelEvents();

  // Track payment initiated
  useEffect(() => {
    if (order && paymentData) {
      console.log('[PixelTracker] Tracking payment initiated');
      trackPaymentInitiated({
        orderId: order.id,
        value: paymentData.value || order.productPrice,
        paymentMethod: 'pix'
      });
    }
  }, [order?.id, paymentData, trackPaymentInitiated]);

  // Track payment completed
  useEffect(() => {
    if (order && paymentStatus === 'CONFIRMED') {
      console.log('[PixelTracker] Tracking payment completed');
      trackPaymentComplete({
        orderId: order.id,
        value: order.productPrice,
        paymentMethod: 'pix'
      });
    }
  }, [order, paymentStatus, trackPaymentComplete]);

  // Expose any methods that might be needed
  return {
    trackInitiateCheckout,
    trackPaymentInitiated,
    trackPaymentComplete
  };
};
