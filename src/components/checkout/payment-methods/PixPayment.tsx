
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PixPaymentData, PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { PixQRCode } from './qr-code/PixQRCode';
import { PixCopyPaste } from './qr-code/PixCopyPaste';
import { PixExpirationTimer } from './qr-code/PixExpirationTimer';
import { PixStatusCheck } from './qr-code/PixStatusCheck';
import { PixConfirmation } from './qr-code/PixConfirmation';

interface PixPaymentProps {
  paymentData: PixPaymentData;
}

export const PixPayment: React.FC<PixPaymentProps> = ({ paymentData }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>(paymentData.status);
  const [checking, setChecking] = useState(false);
  
  const checkStatus = async () => {
    setChecking(true);
    try {
      const newStatus = await checkPaymentStatus(paymentData.paymentId);
      setStatus(newStatus);
      
      if (newStatus === "CONFIRMED") {
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi processado com sucesso.",
        });
        
        // In a real app, redirect to success page
        setTimeout(() => navigate("/success"), 2000);
      } else {
        toast({
          title: "Pagamento pendente",
          description: "Ainda não recebemos a confirmação do seu pagamento.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao verificar",
        description: "Não foi possível verificar o status do pagamento.",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };
  
  // Auto-check status every 15 seconds
  useEffect(() => {
    if (status === "PENDING") {
      const interval = setInterval(() => {
        checkStatus();
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  return (
    <Card className="max-w-md mx-auto shadow-lg pix-container">
      <CardHeader>
        <CardTitle className="text-2xl heading-gradient">Pagamento PIX</CardTitle>
        <CardDescription>
          Escaneie o QR Code ou copie o código para pagar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status === "CONFIRMED" ? (
          <PixConfirmation />
        ) : (
          <>
            <PixQRCode qrCodeImage={paymentData.qrCodeImage} />
            
            <div className="flex flex-col gap-2">
              <PixExpirationTimer expirationDate={paymentData.expirationDate} />
              <PixCopyPaste copyPasteKey={paymentData.copyPasteKey} />
            </div>
            
            <PixStatusCheck checking={checking} onCheck={checkStatus} />
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-white rounded-lg">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-muted-foreground text-xs">{paymentData.description}</p>
        </div>
        <p className="font-bold text-lg">{formatCurrency(paymentData.value)}</p>
      </CardFooter>
    </Card>
  );
};
