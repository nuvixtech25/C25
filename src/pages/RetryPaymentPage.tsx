
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RefreshCcw } from 'lucide-react';
import { ValidationAlert } from '@/components/retry-payment/ValidationAlert';
import { OrderSummary } from '@/components/retry-payment/OrderSummary';
import { RetryLimitMessage } from '@/components/retry-payment/RetryLimitMessage';
import { RetryCardSubmission } from '@/components/retry-payment/RetryCardSubmission';
import { useRetryPaymentData } from '@/hooks/useRetryPaymentData';

const RetryPaymentPage = () => {
  const { 
    order, 
    loading, 
    validationResult, 
    isValidating 
  } = useRetryPaymentData();

  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-asaas-light/30">
        <LoadingSpinner size="lg" message="Carregando dados do pedido..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <RefreshCcw className="mx-auto h-10 w-10 text-asaas-primary mb-2" />
          <CardTitle className="text-2xl">Nova tentativa de pagamento</CardTitle>
          <CardDescription>
            Por favor, utilize outro cartão para tentar novamente.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ValidationAlert validationResult={validationResult} />
          <OrderSummary order={order} />
          
          {validationResult?.canProceed ? (
            <RetryCardSubmission 
              order={order} 
              validationResult={validationResult} 
            />
          ) : (
            <RetryLimitMessage validationResult={validationResult} />
          )}
          
          {/* WhatsApp button has been removed as per user request */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetryPaymentPage;
