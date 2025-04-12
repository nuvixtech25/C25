
import React from 'react';
import { PixPayment } from '@/components/checkout/payment-methods/PixPayment';
import { usePaymentPage } from '@/hooks/usePaymentPage';
import { PaymentHeader } from '@/components/checkout/payment-methods/PaymentHeader';
import { PaymentFooter } from '@/components/checkout/payment-methods/PaymentFooter';
import { PaymentLoadingState } from '@/components/checkout/payment-methods/PaymentLoadingState';
import { PaymentErrorState } from '@/components/checkout/payment-methods/PaymentErrorState';
import { PaymentEmptyState } from '@/components/checkout/payment-methods/PaymentEmptyState';
import { PaymentDecorativeElements } from '@/components/checkout/payment-methods/PaymentDecorativeElements';

const PaymentPage = () => {
  const { loading, paymentData, order, error } = usePaymentPage();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <PaymentDecorativeElements />
      <PaymentHeader />
      
      {loading ? (
        <PaymentLoadingState />
      ) : error ? (
        <PaymentErrorState errorMessage={error} />
      ) : (paymentData && order) ? (
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
          
          <PaymentFooter />
        </div>
      ) : (
        <PaymentEmptyState />
      )}
    </div>
  );
};

export default PaymentPage;
