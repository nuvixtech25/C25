
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PixPaymentStatus } from './PixPaymentStatus';
import { PixQRCodeDisplay } from './PixQRCodeDisplay';
import { PixExpirationTimer } from './PixExpirationTimer';
import { PixCopyPasteField } from './PixCopyPasteField';
import { PixStatusChecker } from './PixStatusChecker';
import { PaymentStatus } from '@/types/checkout';

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
  onCheckStatus
}) => {
  return (
    <Card className="max-w-md mx-auto shadow-lg pix-container">
      <CardHeader>
        <CardTitle className="text-2xl heading-gradient">Pagamento PIX</CardTitle>
        <CardDescription>
          Escaneie o QR Code ou copie o código para pagar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <PixPaymentStatus status={status} />
        
        {status !== "CONFIRMED" && (
          <>
            <PixQRCodeDisplay qrCodeImage={qrCodeImage} />
            
            <PixExpirationTimer timeLeft={timeLeft} />
            
            <PixCopyPasteField copyPasteKey={copyPasteKey} />
            
            <PixStatusChecker 
              isCheckingStatus={isCheckingStatus} 
              onCheckStatus={onCheckStatus} 
            />
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-white rounded-lg">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <p className="font-bold text-lg">{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </CardFooter>
    </Card>
  );
};
