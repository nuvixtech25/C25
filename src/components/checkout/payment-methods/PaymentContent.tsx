
import React from 'react';
import { PixPayment } from '@/components/checkout/payment-methods/PixPayment';
import { PaymentLoadingState } from '@/components/checkout/payment-methods/PaymentLoadingState';
import { PaymentErrorState } from '@/components/checkout/payment-methods/PaymentErrorState';
import { PaymentEmptyState } from '@/components/checkout/payment-methods/PaymentEmptyState';
import { Order, PixPaymentData } from '@/types/checkout';

interface PaymentContentProps {
  loading: boolean;
  error: string | null;
  paymentData: PixPaymentData | null;
  order: Order | null;
}

export const PaymentContent: React.FC<PaymentContentProps> = ({ 
  loading, 
  error, 
  paymentData, 
  order 
}) => {
  if (loading) {
    return <PaymentLoadingState />;
  }
  
  if (error) {
    return <PaymentErrorState errorMessage={error} />;
  }
  
  if (paymentData && order) {
    return (
      <div className="animate-fade-in w-full max-w-md">
        <PixPayment 
          orderId={order.id || ''} 
          qrCode={paymentData.qrCode || ''}
          qrCodeImage={paymentData.qrCodeImage || ''}
          copyPasteKey={paymentData.copyPasteKey || ''}
          expirationDate={paymentData.expirationDate || new Date().toISOString()}
          value={paymentData.value || 0}
          description={paymentData.description || ''}
          paymentId={paymentData.paymentId || ''}
        />
      </div>
    );
  }
  
  return <PaymentEmptyState />;
};
