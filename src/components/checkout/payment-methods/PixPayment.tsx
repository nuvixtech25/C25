
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/types/checkout';
import { usePaymentPolling } from './qr-code/usePaymentPolling';
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
  const [timeLeft, setTimeLeft] = useState('');
  
  // Usar hook de polling para verificar o status do pagamento
  const { status, isCheckingStatus, error, forceCheck } = usePaymentPolling(paymentId, 'PENDING');
  
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
  
  return (
    <PixPaymentContainer
      orderId={orderId}
      paymentId={paymentId}
      qrCode={qrCode}
      qrCodeImage={qrCodeImage}
      copyPasteKey={copyPasteKey}
      expirationDate={expirationDate}
      value={value}
      description={description}
      status={status}
      isCheckingStatus={isCheckingStatus}
      timeLeft={timeLeft}
      onCheckStatus={forceCheck}
    />
  );
};
