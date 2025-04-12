
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
  const [redirecting, setRedirecting] = useState(false);
  
  // Usar hook de polling para verificar o status do pagamento
  const { status, isCheckingStatus, error, forceCheck } = usePaymentPolling(paymentId, 'PENDING');
  
  // Efeito para redirecionar com base no status
  useEffect(() => {
    if (redirecting) return;
    
    if (status === "CONFIRMED") {
      setRedirecting(true);
      
      // Mostrar toast de confirmação
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pagamento foi processado com sucesso.",
      });
      
      // Abrir nova página com a confirmação e então redirecionar
      console.log("Pagamento confirmado, preparando redirecionamento para página de sucesso");
      
      // Tentar abrir uma nova janela com a mensagem de confirmação
      const successWindow = window.open("", "_blank");
      if (successWindow) {
        successWindow.document.write(`
          <html>
            <head>
              <title>Pagamento Aprovado</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0;
                  background-color: #f9f9f9;
                }
                .message {
                  text-align: center;
                  padding: 40px;
                  border-radius: 10px;
                  background-color: white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  border-top: 4px solid #10b981;
                }
                h1 { color: #10b981; }
                p { color: #4b5563; }
              </style>
            </head>
            <body>
              <div class="message">
                <h1>Pagamento Aprovado!</h1>
                <p>Seu pagamento foi confirmado com sucesso.</p>
                <p>Você será redirecionado em instantes...</p>
              </div>
              <script>
                setTimeout(() => {
                  window.location.href = "${window.location.origin}/success";
                }, 2000);
              </script>
            </body>
          </html>
        `);
      }
      
      // Redirecionar a janela atual após um pequeno atraso
      setTimeout(() => navigate("/success", {
        state: {
          order: {
            id: orderId,
            paymentMethod: 'pix',
            status: status
          }
        }
      }), 1500);
    } else if (["CANCELLED", "REFUNDED", "OVERDUE"].includes(status)) {
      setRedirecting(true);
      toast({
        title: "Pagamento não aprovado",
        description: "Houve um problema com seu pagamento.",
        variant: "destructive",
      });
      
      // Redirect to failed page
      console.log("Redirecionando para página de falha após status:", status);
      setTimeout(() => navigate("/payment-failed"), 1500);
    }
  }, [status, navigate, toast, orderId, redirecting]);
  
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
