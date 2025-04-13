import React from 'react';
import { PaymentData, Order } from '@/types/checkout';
import { PixPaymentContainer } from './qr-code/PixPaymentContainer';
import { PixStatusChecker } from './qr-code/PixStatusChecker';
import { CreditCardForm } from './credit-card/CreditCardForm';
import { PaymentStatusMessage } from './PaymentStatusMessage';
import { PaymentErrorMessage } from './PaymentErrorMessage';
import { PaymentLoading } from './PaymentLoading';

interface PaymentContentProps {
  loading: boolean;
  error: any;
  paymentData: PaymentData | null;
  order: Order | null;
  paymentStatus: string | null;
  isCheckingStatus: boolean;
  refreshStatus: () => void;
}

export const PaymentContent: React.FC<PaymentContentProps> = ({
  loading,
  error,
  paymentData,
  order,
  paymentStatus,
  isCheckingStatus,
  refreshStatus
}) => {
  if (loading) {
    return <PaymentLoading />;
  }

  if (error) {
    return <PaymentErrorMessage message={error.message} />;
  }

  if (!paymentData || !order) {
    return <PaymentErrorMessage message="Dados de pagamento ou pedido não encontrados." />;
  }

  if (paymentData.paymentMethod === 'pix') {
    return (
      <div>
        <PixPaymentContainer
          qrCodeImage={paymentData.qrCodeImage}
          qrCode={paymentData.qrCode}
          copyPasteKey={paymentData.copyPasteKey}
          expirationTime={paymentData.expirationTime}
        />
        
        <PixStatusChecker
          orderId={order.id}
          status={paymentStatus}
          isChecking={isCheckingStatus}
          onCheckStatus={refreshStatus}
          hideVerifyButton={true} // Always hide the button
        />
      </div>
    );
  }

  if (paymentData.paymentMethod === 'credit_card') {
    return (
      <CreditCardForm 
        orderId={order.id}
        productPrice={order.productPrice}
      />
    );
  }

  return <PaymentStatusMessage status={paymentStatus} />;
};
