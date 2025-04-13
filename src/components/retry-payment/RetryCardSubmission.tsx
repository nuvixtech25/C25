
import React from 'react';
import { CreditCard } from 'lucide-react';
import { CreditCardData, Order } from '@/types/checkout';
import RetryPaymentForm from '@/components/retry-payment/RetryPaymentForm';
import { ValidationAlert } from '@/components/retry-payment/ValidationAlert';
import { OrderSummary } from '@/components/retry-payment/OrderSummary';
import { RetryLimitMessage } from '@/components/retry-payment/RetryLimitMessage';

interface RetryCardSubmissionProps {
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  cardData?: CreditCardData;
  order: Order | null;
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null;
  hasWhatsappSupport: boolean;
  whatsappNumber: string | undefined; // Updated type to match what's being passed
}

export const RetryCardSubmission: React.FC<RetryCardSubmissionProps> = ({ 
  onSubmit, 
  isLoading, 
  cardData,
  order,
  validationResult,
  hasWhatsappSupport,
  whatsappNumber
}) => {
  return (
    <>
      <ValidationAlert validationResult={validationResult} />
      <OrderSummary order={order} />
          
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-purple-800">Utilizar um cartão diferente aumenta suas chances de aprovação.</p>
        </div>
      </div>
      
      {validationResult?.canProceed ? (
        <RetryPaymentForm
          order={order}
          validationResult={validationResult}
          onSubmit={onSubmit}
          isLoading={isLoading}
          cardData={cardData}
        />
      ) : (
        <RetryLimitMessage validationResult={validationResult} />
      )}
    </>
  );
};
