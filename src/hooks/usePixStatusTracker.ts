
import { useState, useEffect } from 'react';
import { PixPaymentData, Order, PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';
import { handleApiError } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';

export const usePixStatusTracker = (
  paymentData: PixPaymentData | null,
  order: Order | null
) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();

  // Check payment status periodically
  useEffect(() => {
    if (!paymentData?.paymentId || !order) return;

    const checkStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const result = await checkPaymentStatus(paymentData.paymentId);
        
        // Type guard to handle different possible return types
        if (typeof result === 'string') {
          setPaymentStatus(result as PaymentStatus);
        } else if (result && typeof result === 'object') {
          // If result is an object with a status property
          const status = 'status' in result ? (result as { status: PaymentStatus }).status : null;
          if (status) {
            setPaymentStatus(status);
          }
        }

        // If payment is confirmed, show success toast
        const isConfirmed = 
          result === 'CONFIRMED' || 
          (typeof result === 'object' && result && 'status' in result && result.status === 'CONFIRMED');

        if (isConfirmed) {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pagamento foi recebido com sucesso.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        handleApiError(error, {
          defaultMessage: "Não foi possível verificar o status do pagamento."
        });
      } finally {
        setIsCheckingStatus(false);
      }
    };

    // Initial check
    checkStatus();
    
    return () => {
      // Cleanup if needed
    };
  }, [paymentData?.paymentId, order, toast]);

  const refreshStatus = async () => {
    if (!paymentData?.paymentId) return;
    
    setIsCheckingStatus(true);
    try {
      const result = await checkPaymentStatus(paymentData.paymentId);
      
      // Type guard to handle different possible return types
      if (typeof result === 'string') {
        setPaymentStatus(result as PaymentStatus);
      } else if (result && typeof result === 'object') {
        // If result is an object with a status property
        const status = 'status' in result ? (result as { status: PaymentStatus }).status : null;
        if (status) {
          setPaymentStatus(status);
        }
      }
    } catch (error) {
      console.error("Error refreshing payment status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return {
    paymentStatus,
    isCheckingStatus,
    refreshStatus
  };
};

