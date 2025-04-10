
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/types/checkout';
import { usePaymentPolling } from '@/components/checkout/payment-methods/qr-code/usePaymentPolling';

interface UsePixPaymentStatusProps {
  paymentId: string;
  orderId: string;
  expirationDate: string;
}

interface UsePixPaymentStatusResult {
  status: PaymentStatus;
  timeLeft: string;
  isCheckingStatus: boolean;
  forceCheckStatus: () => void;
  isExpired: boolean;
}

export const usePixPaymentStatus = ({
  paymentId,
  orderId,
  expirationDate
}: UsePixPaymentStatusProps): UsePixPaymentStatusResult => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  
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
        setIsExpired(true);
        return '00:00:00';
      }
      
      setIsExpired(false);
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

  return {
    status,
    timeLeft,
    isCheckingStatus,
    forceCheckStatus: forceCheck,
    isExpired
  };
};
