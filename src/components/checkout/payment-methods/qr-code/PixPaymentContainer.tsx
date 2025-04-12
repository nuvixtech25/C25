
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
import { Sparkles, ShieldCheck, QrCode } from 'lucide-react';

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
  productType?: 'digital' | 'physical';
}

// Helper function to validate QR code image
const isValidQRCodeImage = (qrCodeImage: string): boolean => {
  if (!qrCodeImage || qrCodeImage.trim() === '') return false;
  // Check if it's a valid data URL starting with data:image
  return qrCodeImage.startsWith('data:image');
};

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
  onCheckStatus,
  productType = 'physical'
}) => {
  const { toast } = useToast();
  const isPending = status === "PENDING";
  const showQRCode = isPending && !isExpired;
  const hasValidQRCode = isValidQRCodeImage(qrCodeImage);
  
  // Log importantes ao montar o componente para diagnóstico
  useEffect(() => {
    console.log("PixPaymentContainer - Status do pagamento:", status);
    console.log("PixPaymentContainer - ID do pagamento:", paymentId);
    console.log("PixPaymentContainer - ID do pedido:", orderId);
    console.log("PixPaymentContainer - Exibir QR code:", showQRCode);
    console.log("PixPaymentContainer - QR Code Image válido:", hasValidQRCode);
    console.log("PixPaymentContainer - Product Type:", productType);
    
    if (!hasValidQRCode) {
      console.warn("QR Code Image inválido:", qrCodeImage ? 
        `Começa com: ${qrCodeImage.substring(0, 30)}...` : "Não fornecido");
      
      // Notificar o usuário sobre o problema do QR code
      if (isPending) {
        toast({
          title: "Alternativa para o QR Code",
          description: "Use o código de cópia e cola abaixo para realizar o pagamento.",
          variant: "default", 
        });
      }
    }
  }, [orderId, paymentId, qrCodeImage, status, showQRCode, toast, isPending, hasValidQRCode, productType]);
  
  return (
    <Card className="max-w-md mx-auto shadow-xl border-0 rounded-xl overflow-hidden animate-fade-in pix-container bg-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-asaas-primary via-asaas-secondary to-purple-400"></div>
      
      <CardHeader className="bg-gradient-to-r from-asaas-primary/95 to-asaas-secondary/95 text-white pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center font-bold">
            <QrCode className="mr-2 h-6 w-6" />
            Pagamento PIX
          </CardTitle>
          
          <div className="bg-white/20 rounded-full p-1">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <CardDescription className="text-white/90 mt-2">
          {showQRCode ? (hasValidQRCode ? 
            'Escaneie o QR Code ou copie o código para pagar' : 
            'Utilize o código PIX abaixo para pagamento') : 
            'Detalhes do pagamento'}
        </CardDescription>
        
        <div className="mt-4 flex items-center text-xs text-white/80 bg-black/10 w-fit rounded-full px-3 py-1">
          <ShieldCheck className="h-3 w-3 mr-1.5" />
          <span>Pagamento Seguro</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white/0 pointer-events-none"></div>
        
        {/* Status de pagamento */}
        <PixPaymentStatus status={status} />
        
        {/* Exibe o QR Code apenas se o pagamento estiver pendente e não expirado */}
        {showQRCode && (
          <div className="space-y-6 animate-scale-in relative z-10">
            <PixQRCodeDisplay qrCodeImage={qrCodeImage} />
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100">
              <PixExpirationTimer timeLeft={timeLeft} isExpired={isExpired} />
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-2">Código PIX copia e cola:</p>
              <PixCopyPasteField copyPasteKey={copyPasteKey} />
            </div>
            
            <PixStatusChecker 
              isCheckingStatus={isCheckingStatus} 
              onCheckStatus={onCheckStatus} 
            />
          </div>
        )}
        
        {/* Se estiver expirado mas ainda PENDING, mostre opção de verificar status */}
        {isExpired && isPending && (
          <PixStatusChecker 
            isCheckingStatus={isCheckingStatus} 
            onCheckStatus={onCheckStatus} 
          />
        )}
      </CardContent>
      
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
      
      <PixPaymentDetails description={description} value={value} />
    </Card>
  );
};
