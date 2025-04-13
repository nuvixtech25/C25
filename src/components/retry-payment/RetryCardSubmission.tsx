
import React from 'react';
import { CreditCardData, Order } from '@/types/checkout';
import RetryPaymentForm from './RetryPaymentForm';
import { RetryLimitMessage } from './RetryLimitMessage';
import WhatsAppSupportLink from './WhatsAppSupportLink';

interface RetryCardSubmissionProps {
  order: Order | null;
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null;
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
}

export const RetryCardSubmission: React.FC<RetryCardSubmissionProps> = ({
  order,
  validationResult,
  onSubmit,
  isLoading,
  hasWhatsappSupport,
  whatsappNumber,
}) => {
  // If we're not allowed to proceed, show the retry limit message
  if (validationResult && !validationResult.canProceed) {
    return <RetryLimitMessage message={validationResult.message} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {order && (
          <div className="text-gray-700">
            <p className="font-medium mb-1">Detalhes do pedido:</p>
            <p className="text-sm">Produto: {order.productName}</p>
            <p className="text-sm">Valor: R$ {order.productPrice.toFixed(2)}</p>
          </div>
        )}
        
        <RetryPaymentForm
          order={order}
          validationResult={validationResult}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
      
      {hasWhatsappSupport && whatsappNumber && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <WhatsAppSupportLink whatsappNumber={whatsappNumber} />
        </div>
      )}
    </div>
  );
};

export default RetryCardSubmission;
