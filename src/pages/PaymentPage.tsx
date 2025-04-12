
import React from 'react';
import { usePaymentPage } from '@/hooks/usePaymentPage';
import { PaymentHeader } from '@/components/checkout/payment-methods/PaymentHeader';
import { PaymentFooter } from '@/components/checkout/payment-methods/PaymentFooter';
import { PaymentContent } from '@/components/checkout/payment-methods/PaymentContent';
import { PaymentDecorativeElements } from '@/components/checkout/payment-methods/PaymentDecorativeElements';

const PaymentPage = () => {
  const { loading, paymentData, order, error } = usePaymentPage();
  
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
