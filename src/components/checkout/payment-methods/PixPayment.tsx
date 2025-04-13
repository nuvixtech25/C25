
import React, { useEffect } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { PixPaymentContainer } from './qr-code/PixPaymentContainer';

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
  status?: PaymentStatus | null;
  isCheckingStatus?: boolean;
  onCheckStatus?: () => void;
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
  productType = 'physical',
  status = null,
  isCheckingStatus = false,
  onCheckStatus = () => {}
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
    productType,
    status,
    isCheckingStatus
  });
  
  // Ensure we have valid values for all props before passing them to child components
  const safeDescription = description || 'Pagamento PIX';
  
  // Use um hook personalizado para gerenciar o status do pagamento e timeout se nenhum status for fornecido
  // Se status e onCheckStatus forem fornecidos, usamos eles em vez do hook
  
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
      status={status || "PENDING"}
      isCheckingStatus={isCheckingStatus}
      timeLeft={""} // Isso será calculado internamente se necessário
      isExpired={false} // Será determinado internamente se necessário
      onCheckStatus={onCheckStatus}
      productType={productType}
    />
  );
};
