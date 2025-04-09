
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PixPaymentData, PaymentStatus } from '@/types/checkout';
import { Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { checkPaymentStatus } from '@/services/asaasService';
import { useNavigate } from 'react-router-dom';

interface PixPaymentProps {
  paymentData: PixPaymentData;
}

export const PixPayment: React.FC<PixPaymentProps> = ({ paymentData }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(paymentData.status);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Format expiration date and set countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationTime = new Date(paymentData.expirationDate).getTime();
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
  }, [paymentData.expirationDate]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentData.copyPasteKey).then(
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
          <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
            <Check className="w-16 h-16 mx-auto text-green-500 mb-2" />
            <h3 className="text-xl font-semibold text-green-700">Pagamento Confirmado!</h3>
            <p className="text-green-600">Seu pagamento foi processado com sucesso.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              {paymentData.qrCodeImage ? (
                <img 
                  src={paymentData.qrCodeImage} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-asaas-primary" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm text-center text-muted-foreground">
                {timeLeft ? (
                  <span>Expira em: <span className="font-semibold">{timeLeft}</span></span>
                ) : (
                  <span>Carregando tempo restante...</span>
                )}
              </p>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="text-xs truncate flex-1 mr-2 font-mono">
                  {paymentData.copyPasteKey}
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
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={checkStatus} 
                disabled={checking}
                variant="outline"
                className="w-full"
              >
                {checking ? (
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
          <p className="text-muted-foreground text-xs">{paymentData.description}</p>
        </div>
        <p className="font-bold text-lg">{formatCurrency(paymentData.value)}</p>
      </CardFooter>
    </Card>
  );
};
