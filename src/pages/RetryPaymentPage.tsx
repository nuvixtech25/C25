
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RefreshCcw, CreditCard } from 'lucide-react';
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
    isValidating,
    hasWhatsappSupport,
    whatsappNumber
  } = useRetryPaymentData();

  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
        <LoadingSpinner size="lg" message="Carregando dados do pedido..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <Card className="max-w-md w-full shadow-xl border border-purple-100 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 w-full" />
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-100">
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Nova tentativa de pagamento</CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            Por favor, utilize outro cartão para tentar novamente.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ValidationAlert validationResult={validationResult} />
          <OrderSummary order={order} />
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-start">
              <RefreshCcw className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-purple-800">Utilizar um cartão diferente aumenta suas chances de aprovação.</p>
            </div>
          </div>
          
          {validationResult?.canProceed ? (
            <RetryCardSubmission 
              order={order} 
              validationResult={validationResult}
              hasWhatsappSupport={hasWhatsappSupport}
              whatsappNumber={whatsappNumber}
            />
          ) : (
            <RetryLimitMessage validationResult={validationResult} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetryPaymentPage;
