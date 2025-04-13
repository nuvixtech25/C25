
import { useEffect } from 'react';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { Order, PixPaymentData, PaymentStatus } from '@/types/checkout';

export const usePaymentPixelTracker = (
  order: Order | null,
  paymentData: PixPaymentData | null,
  paymentStatus: PaymentStatus | null
) => {
  const { trackPurchase } = usePixelEvents();

  // Track payment initiated
  useEffect(() => {
    if (order?.id && paymentData) {
      console.log('[PixelTracker] Tracking payment initiated');
      trackPurchase(
        order.id,
        paymentData.value || order.productPrice
      );
    }
  }, [order?.id, paymentData, trackPurchase]);

  // Track payment completed
  useEffect(() => {
    if (order?.id && paymentStatus === 'CONFIRMED') {
      console.log('[PixelTracker] Tracking payment completed');
      trackPurchase(
        order.id,
        order.productPrice
      );
    }
  }, [order, paymentStatus, trackPurchase]);

  return {
    trackPurchase
  };
};

