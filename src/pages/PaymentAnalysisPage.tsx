
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PaymentAnalysisContent } from '@/components/payment-analysis/PaymentAnalysisContent';
import { usePaymentAnalysis } from '@/hooks/usePaymentAnalysis';

const PaymentAnalysisPage: React.FC = () => {
  const { state } = useLocation();
  
  // Extract data from location state
  const initialState = {
    initialOrder: state?.order || null,
    hasWhatsappSupport: state?.hasWhatsappSupport || false,
    whatsappNumber: state?.whatsappNumber || '',
    product: state?.product || null
  };
  
  // Use the payment analysis hook
  const { order, loading } = usePaymentAnalysis(initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <PaymentAnalysisContent order={order} />
    </div>
  );
};

export default PaymentAnalysisPage;
