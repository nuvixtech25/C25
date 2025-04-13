
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRetryValidation } from '@/hooks/useRetryValidation';
import { Order } from '@/types/checkout';
import { useOrderData } from '@/hooks/useOrderData';
import { useWhatsAppSupport } from '@/hooks/useWhatsAppSupport';
import { logPaymentError } from '@/utils/paymentErrorHandler';
import { PaymentErrorMessages } from '@/utils/paymentErrorHandler';

export const useRetryPaymentData = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { order, setOrder, loading, setLoading, fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const [validationResult, setValidationResult] = useState<{
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null>(null);
  
  const { validateRetryAttempt, isValidating } = useRetryValidation();
  const { hasWhatsappSupport, whatsappNumber } = useWhatsAppSupport(order?.productId);
  const [hasError, setHasError] = useState(false);

  // Fetch order data if not provided in location state
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // If order is provided in location state, use it
        if (state?.order) {
          console.log('[RetryPaymentPage] Using order from state:', state.order);
          setOrder(state.order);
          
          // Check if the order object has all required fields
          if (!state.order.id || !state.order.productPrice) {
            console.error('[RetryPaymentPage] Order from state is missing required fields:', state.order);
            setHasError(true);
            toast({
              title: "Erro",
              description: "Dados do pedido incompletos",
              variant: "destructive",
            });
            return;
          }
        } else {
          // Otherwise, get orderId from URL parameters
          const orderId = getOrderIdFromUrl();
          
          if (!orderId) {
            console.error('[RetryPaymentPage] No orderId found in URL parameters');
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.ORDER_NOT_FOUND,
              variant: "destructive",
            });
            return;
          }

          const fetchedOrder = await fetchOrderById(orderId);
          
          if (!fetchedOrder) {
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.ORDER_NOT_FOUND,
              variant: "destructive",
            });
            return;
          }
          
          // Check if all required fields are present
          if (!fetchedOrder.id || !fetchedOrder.productPrice) {
            console.error('[RetryPaymentPage] Fetched order is missing required fields:', fetchedOrder);
            setHasError(true);
            toast({
              title: "Erro",
              description: PaymentErrorMessages.INVALID_ORDER,
              variant: "destructive",
            });
            return;
          }
          
          setOrder(fetchedOrder);
        }

        // Check retry limit for the order
        const currentOrder = state?.order || order;
        if (currentOrder?.id) {
          checkRetryLimit(currentOrder.id);
        }
      } catch (error) {
        logPaymentError("RetryPaymentPage", error, "Error fetching order");
        setHasError(true);
        toast({
          title: "Erro",
          description: PaymentErrorMessages.LOAD_ERROR,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, state, toast, getOrderIdFromUrl, fetchOrderById, setOrder, order]);

  // Check if we can retry payment
  const checkRetryLimit = async (orderId: string) => {
    try {
      if (!orderId) return;
      
      console.log('[RetryPaymentPage] Checking retry limit for order:', orderId);
      
      const result = await validateRetryAttempt(orderId, {
        maxAttempts: 3,
        minMinutes: 5,
        enforceDelay: false // Por enquanto, não bloqueamos por tempo
      });
      
      console.log('[RetryPaymentPage] Validation result:', result);
      
      setValidationResult(result);
      
      if (!result.canProceed) {
        toast({
          title: "Limite atingido",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      logPaymentError("RetryPaymentPage", error, "Error checking retry limit");
    }
  };

  return {
    order,
    loading,
    isSubmitting,
    setIsSubmitting,
    validationResult,
    isValidating,
    hasWhatsappSupport,
    whatsappNumber,
    validateRetryAttempt,
    checkRetryLimit,
    hasError
  };
};
