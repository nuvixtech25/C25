
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { PixPaymentContainer } from './qr-code/PixPaymentContainer';
import { usePixPaymentStatus } from '@/hooks/usePixPaymentStatus';

interface PixPaymentProps {
  orderId: string;
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  value: number;
  description: string;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  orderId,
  paymentId,
  qrCode,
  qrCodeImage,
  copyPasteKey,
  expirationDate,
  value,
  description
}) => {
  console.log("PixPayment - Rendering with props:", {
    orderId,
    paymentId: paymentId || "N/A",
    hasQRCode: !!qrCode,
    hasQRImage: !!qrCodeImage,
    hasCopyPasteKey: !!copyPasteKey,
    expirationDate,
    value: typeof value === 'number' ? value : 0, // Log the actual value with validation
    description
  });
  
  // Ensure we have valid values for all props before passing them to child components
  const safeValue = typeof value === 'number' ? value : 0;
  const safeDescription = description || 'Pagamento PIX';
  
  // Usar custom hook para gerenciar o status do pagamento e timeout
  const {
    status,
    timeLeft,
    isCheckingStatus,
    forceCheckStatus,
    isExpired
  } = usePixPaymentStatus({
    paymentId,
    orderId,
    expirationDate
  });
  
  return (
    <PixPaymentContainer
      orderId={orderId}
      paymentId={paymentId}
      qrCode={qrCode}
      qrCodeImage={qrCodeImage}
      copyPasteKey={copyPasteKey}
      expirationDate={expirationDate}
      value={safeValue}
      description={safeDescription}
      status={status}
      isCheckingStatus={isCheckingStatus}
      timeLeft={timeLeft}
      isExpired={isExpired}
      onCheckStatus={forceCheckStatus}
    />
  );
};
