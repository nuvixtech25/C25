
import React from 'react';
import { PaymentData, Order } from '@/types/checkout';
import { PixPaymentContainer } from './PixPaymentContainer';
import { PixStatusChecker } from './PixStatusChecker';

interface PixPaymentWrapperProps {
  paymentData: PaymentData | null;
  order: Order | null;
  paymentStatus: string | null;
  isCheckingStatus: boolean;
  refreshStatus: () => void;
}

export const PixPaymentWrapper: React.FC<PixPaymentWrapperProps> = ({
  paymentData,
  order,
  paymentStatus,
  isCheckingStatus,
  refreshStatus
}) => {
  if (!paymentData || !order) return null;
  
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
};
