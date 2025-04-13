
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
  const { trackPurchase } = usePixelEvents();

  // Track payment initiated
  useEffect(() => {
    if (order && paymentData) {
      console.log('[PixelTracker] Tracking payment initiated');
      // Since trackPaymentInitiated doesn't exist, we'll use trackPurchase
      // with a custom event parameter to differentiate it
      trackPurchase(
        order.id,
        paymentData.value || order.productPrice
      );
    }
  }, [order?.id, paymentData, trackPurchase]);

  // Track payment completed
  useEffect(() => {
    if (order && paymentStatus === 'CONFIRMED') {
      console.log('[PixelTracker] Tracking payment completed');
      trackPurchase(
        order.id,
        order.productPrice
      );
    }
  }, [order, paymentStatus, trackPurchase]);

  // Expose methods that might be needed
  return {
    trackPurchase
  };
};
