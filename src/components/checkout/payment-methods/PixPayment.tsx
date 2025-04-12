
import React, { useEffect } from 'react';
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
  productType?: 'digital' | 'physical';
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  orderId,
  paymentId,
  qrCode,
  qrCodeImage,
  copyPasteKey,
  expirationDate,
  value,
  description,
  productType = 'physical'
}) => {
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  console.log("PixPayment - Rendering with props:", {
    orderId,
    paymentId: paymentId || "N/A",
    hasQRCode: !!qrCode,
    hasQRImage: !!qrCodeImage,
    hasCopyPasteKey: !!copyPasteKey,
    expirationDate,
    value: safeValue, // Log the actual safe value
    valueType: typeof safeValue,
    description,
    productType
  });
  
  // Ensure we have valid values for all props before passing them to child components
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
    expirationDate,
    productType
  });
  
  // Log when payment status changes
  useEffect(() => {
    console.log(`Payment status in PixPayment component: ${status}`);
  }, [status]);
  
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
      timeLeft={timeLeft.toString()} // Convert timeLeft to string to match the expected type
      isExpired={isExpired}
      onCheckStatus={forceCheckStatus}
      productType={productType}
    />
  );
};
