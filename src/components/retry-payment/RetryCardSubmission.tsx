
import React from 'react';
import { CreditCardData, Order } from '@/types/checkout';
import RetryPaymentForm from '@/components/retry-payment/RetryPaymentForm';

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
  whatsappNumber: string;
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
    <RetryPaymentForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      cardData={cardData}
      order={order}
      validationResult={validationResult}
    />
  );
};
