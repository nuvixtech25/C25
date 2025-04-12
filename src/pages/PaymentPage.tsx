
import React, { useEffect } from 'react';
import { usePaymentPage } from '@/hooks/usePaymentPage';
import { PaymentHeader } from '@/components/checkout/payment-methods/PaymentHeader';
import { PaymentFooter } from '@/components/checkout/payment-methods/PaymentFooter';
import { PaymentContent } from '@/components/checkout/payment-methods/PaymentContent';
import { PaymentDecorativeElements } from '@/components/checkout/payment-methods/PaymentDecorativeElements';

const PaymentPage = () => {
  const { loading, paymentData, order, error } = usePaymentPage();
  
  // Adicionar logs para diagnosticar problemas na renderização
  useEffect(() => {
    console.group('PaymentPage Component');
    console.log('Loading:', loading);
    console.log('Has payment data:', !!paymentData);
    console.log('Has order:', !!order);
    console.log('Error:', error);
    
    if (paymentData) {
      console.log('Payment data details:', {
        paymentId: paymentData.paymentId,
        hasQRCode: !!paymentData.qrCode,
        hasQRCodeImage: !!paymentData.qrCodeImage,
        hasCopyPasteKey: !!paymentData.copyPasteKey,
      });
    }
    
    if (order) {
      console.log('Order details:', {
        id: order.id,
        status: order.status,
        value: order.productPrice
      });
    }
    
    console.groupEnd();
  }, [loading, paymentData, order, error]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <PaymentDecorativeElements />
      <PaymentHeader />
      
      <PaymentContent 
        loading={loading}
        error={error}
        paymentData={paymentData}
        order={order}
      />
      
      {paymentData && order && <PaymentFooter />}
    </div>
  );
};

export default PaymentPage;
