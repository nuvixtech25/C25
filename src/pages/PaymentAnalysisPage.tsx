
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PaymentAnalysisContent } from '@/components/payment-analysis/PaymentAnalysisContent';
import { usePaymentAnalysis } from '@/hooks/usePaymentAnalysis';

// Make sure we're properly constraining the order id type
interface PaymentAnalysisOrder {
  id: string;
  [key: string]: any; // Allow for other properties on the order object
}

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

  // Only pass the order to PaymentAnalysisContent if it has a valid id
  const validOrder: PaymentAnalysisOrder | null = order && order.id ? 
    { id: order.id, ...order } : 
    null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <PaymentAnalysisContent order={validOrder} />
    </div>
  );
};

export default PaymentAnalysisPage;
