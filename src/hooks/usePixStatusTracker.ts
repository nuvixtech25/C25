
import { useState, useEffect } from 'react';
import { PixPaymentData, Order, PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';
import { handleApiError } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for tracking PIX payment status
 */
export const usePixStatusTracker = (
  paymentData: PixPaymentData | null,
  order: Order | null
) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    paymentData?.status as PaymentStatus || null
  );
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();

  // Check payment status periodically
  useEffect(() => {
    if (!paymentData?.paymentId || !order) return;

    const checkStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const status = await checkPaymentStatus(paymentData.paymentId);
        
        if (typeof status === 'string') {
          setPaymentStatus(status as PaymentStatus);
        } else if (status && 'status' in status) {
          setPaymentStatus(status.status);
        }

        // If payment is confirmed, show success toast
        if (
          (typeof status === 'string' && status === 'CONFIRMED') ||
          (status && 'status' in status && status.status === 'CONFIRMED')
        ) {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pagamento foi recebido com sucesso.",
            variant: "success",
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
      const status = await checkPaymentStatus(paymentData.paymentId);
      
      if (typeof status === 'string') {
        setPaymentStatus(status as PaymentStatus);
      } else if (status && 'status' in status) {
        setPaymentStatus(status.status);
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
