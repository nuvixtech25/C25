
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PixPaymentStatus } from './PixPaymentStatus';
import { PixQRCodeDisplay } from './PixQRCodeDisplay';
import { PixExpirationTimer } from './PixExpirationTimer';
import { PixCopyPasteField } from './PixCopyPasteField';
import { PixStatusChecker } from './PixStatusChecker';
import { PixPaymentDetails } from './PixPaymentDetails';
import { PaymentStatus } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

interface PixPaymentContainerProps {
  orderId: string;
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  value: number;
  description: string;
  status: PaymentStatus;
  isCheckingStatus: boolean;
  timeLeft: string;
  isExpired: boolean;
  onCheckStatus: () => void;
}

export const PixPaymentContainer: React.FC<PixPaymentContainerProps> = ({
  orderId,
  paymentId,
  qrCode,
  qrCodeImage,
  copyPasteKey,
  expirationDate,
  value,
  description,
  status,
  isCheckingStatus,
  timeLeft,
  isExpired,
  onCheckStatus
}) => {
  const { toast } = useToast();
  const isPending = status === "PENDING";
  const showQRCode = isPending && !isExpired;
  
  // Effects for debugging QR code
  useEffect(() => {
    console.log("PixPaymentContainer - QR Code Image URL:", qrCodeImage ? `${qrCodeImage.substring(0, 30)}...` : 'No QR Code');
    console.log("PixPaymentContainer - Payment Status:", status);
    console.log("PixPaymentContainer - Copy/Paste Key Length:", copyPasteKey ? copyPasteKey.length : 0);
  }, [qrCodeImage, status, copyPasteKey]);

  return (
    <Card className="max-w-md mx-auto shadow-lg pix-container">
      <CardHeader>
        <CardTitle className="text-2xl heading-gradient">Pagamento PIX</CardTitle>
        <CardDescription>
          {showQRCode ? 'Escaneie o QR Code ou copie o código para pagar' : 'Detalhes do pagamento'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status de pagamento */}
        <PixPaymentStatus status={status} />
        
        {/* Exibe o QR Code apenas se o pagamento estiver pendente e não expirado */}
        {showQRCode && (
          <>
            <PixQRCodeDisplay qrCodeImage={qrCodeImage} />
            
            <PixExpirationTimer timeLeft={timeLeft} isExpired={isExpired} />
            
            <PixCopyPasteField copyPasteKey={copyPasteKey} />
            
            <PixStatusChecker 
              isCheckingStatus={isCheckingStatus} 
              onCheckStatus={onCheckStatus} 
            />
          </>
        )}
        
        {/* Se estiver expirado mas ainda PENDING, mostre opção de verificar status */}
        {isExpired && isPending && (
          <PixStatusChecker 
            isCheckingStatus={isCheckingStatus} 
            onCheckStatus={onCheckStatus} 
          />
        )}
      </CardContent>
      
      <PixPaymentDetails description={description} value={value} />
    </Card>
  );
};
