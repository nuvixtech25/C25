
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

  // Extract the status normalization logic to a separate function
  const normalizePaymentStatus = (result: any): PaymentStatus | null => {
    if (typeof result === 'string') {
      return result as PaymentStatus;
    } else if (result && typeof result === 'object') {
      // If result is an object with a status property
      if ('status' in result) {
        return (result as { status: PaymentStatus }).status;
      }
    }
    return null;
  };

  // Extract the logic to check if payment is confirmed
  const isPaymentConfirmed = (result: any): boolean => {
    return result === 'CONFIRMED' || 
      (typeof result === 'object' && 
       result && 
       'status' in result && 
       result.status === 'CONFIRMED');
  };

  // Show success toast when payment is confirmed
  const showConfirmationToast = () => {
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi recebido com sucesso.",
      variant: "default",
    });
  };

  // Process the payment status result
  const processPaymentStatusResult = (result: any) => {
    const status = normalizePaymentStatus(result);
    if (status) {
      setPaymentStatus(status);
    }

    // Check if payment is confirmed to show toast
    if (isPaymentConfirmed(result)) {
      showConfirmationToast();
    }
  };

  // Check payment status
  const performStatusCheck = async (paymentId: string) => {
    setIsCheckingStatus(true);
    try {
      const result = await checkPaymentStatus(paymentId);
      processPaymentStatusResult(result);
    } catch (error) {
      console.error("Error checking payment status:", error);
      handleApiError(error, {
        defaultMessage: "Não foi possível verificar o status do pagamento."
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Check payment status periodically
  useEffect(() => {
    if (!paymentData?.paymentId || !order) return;

    // Initial check
    performStatusCheck(paymentData.paymentId);
    
    return () => {
      // Cleanup if needed
    };
  }, [paymentData?.paymentId, order, toast]);

  // Public method to manually refresh status
  const refreshStatus = async () => {
    if (!paymentData?.paymentId) return;
    performStatusCheck(paymentData.paymentId);
  };

  return {
    paymentStatus,
    isCheckingStatus,
    refreshStatus
  };
};
