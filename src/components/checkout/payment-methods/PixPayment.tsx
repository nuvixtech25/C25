
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { usePaymentPolling } from './qr-code/usePaymentPolling';
import { PaymentStatus } from '@/types/checkout';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Usar hook de polling para verificar o status do pagamento
  const { status, isCheckingStatus, error, forceCheck } = usePaymentPolling(paymentId, 'PENDING');
  
  // Function to copy PIX code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyPasteKey).then(
      () => {
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no app do seu banco para pagar",
        });
        
        setTimeout(() => setCopied(false), 3000);
      },
      () => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código",
          variant: "destructive",
        });
      }
    );
  };
  
  // Efeito para redirecionar com base no status
  useEffect(() => {
    if (status === "CONFIRMED") {
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pagamento foi processado com sucesso.",
      });
      
      // Redirect to success page
      setTimeout(() => navigate("/success"), 2000);
    } else if (["CANCELLED", "REFUNDED", "OVERDUE"].includes(status)) {
      toast({
        title: "Pagamento não aprovado",
        description: "Houve um problema com seu pagamento.",
        variant: "destructive",
      });
      
      // Redirect to failed page
      setTimeout(() => navigate("/payment-failed"), 2000);
    }
  }, [status, navigate, toast]);
  
  // Calculate time left for expiration
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationTime = new Date(expirationDate).getTime();
      const now = new Date().getTime();
      const difference = expirationTime - now;
      
      if (difference <= 0) {
        return '00:00:00';
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    };
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [expirationDate]);
  
  // Render payment confirmation or QR code based on status
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
          <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
            <Check className="w-16 h-16 mx-auto text-green-500 mb-2" />
            <h3 className="text-xl font-semibold text-green-700">Pagamento Confirmado!</h3>
            <p className="text-green-600">Seu pagamento foi processado com sucesso.</p>
          </div>
        ) : (
          <>
            {/* QR Code Display */}
            <div className="flex justify-center">
              {qrCodeImage ? (
                <img 
                  src={qrCodeImage} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-asaas-primary" />
                </div>
              )}
            </div>
            
            {/* Expiration Timer */}
            <p className="text-sm text-center text-muted-foreground">
              {timeLeft ? (
                <span>Expira em: <span className="font-semibold">{timeLeft}</span></span>
              ) : (
                <span>Carregando tempo restante...</span>
              )}
            </p>
            
            {/* Copy/Paste Code */}
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="text-xs truncate flex-1 mr-2 font-mono">
                {copyPasteKey}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={copyToClipboard}
                className="min-w-[100px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            
            {/* Check Payment Status Button */}
            <div className="pt-2">
              <Button 
                onClick={() => forceCheck()} 
                disabled={isCheckingStatus}
                variant="outline"
                className="w-full"
              >
                {isCheckingStatus ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Verificar pagamento
              </Button>
            </div>
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
