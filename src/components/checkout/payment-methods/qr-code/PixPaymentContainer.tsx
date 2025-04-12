
import React from 'react';
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
  React.useEffect(() => {
    console.log("QR Code Image URL:", qrCodeImage);
    console.log("Payment Status:", status);
  }, [qrCodeImage, status]);

  // Handle image error
  const handleImageError = () => {
    console.error("QR Code image failed to load:", qrCodeImage);
    toast({
      title: "Erro ao carregar QR Code",
      description: "Não foi possível exibir o QR Code. Por favor, use o código PIX copia e cola.",
      variant: "destructive",
    });
  };
  
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
            <div className="flex justify-center">
              {qrCodeImage ? (
                <img 
                  src={qrCodeImage} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
                  onError={handleImageError}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">QR Code não disponível</p>
                    <p className="text-xs text-gray-400">Use o código copia e cola abaixo</p>
                  </div>
                </div>
              )}
            </div>
            
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
