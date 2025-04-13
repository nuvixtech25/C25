import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrderData } from '@/hooks/useOrderData';
import { checkPaymentStatus } from '@/services/asaasService';
import { Order, PaymentStatus } from '@/types/checkout';
import { logPaymentError } from '@/utils/paymentErrorHandler';

// Lista definitiva de status que são considerados como falha
const FAILURE_STATUSES: PaymentStatus[] = ['DECLINED', 'FAILED', 'CANCELLED'];

// Lista definitiva de status que são considerados como sucesso
const SUCCESS_STATUSES: PaymentStatus[] = ['CONFIRMED'];

interface UsePaymentAnalysisProps {
  initialOrder?: Order;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
  product?: {
    has_whatsapp_support?: boolean;
    whatsapp_number?: string;
  };
}

export const usePaymentAnalysis = ({
  initialOrder,
  hasWhatsappSupport,
  whatsappNumber,
  product
}: UsePaymentAnalysisProps = {}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const maxChecks = 10; // Maximum number of checks before redirecting

  // Navigate to success page with appropriate props
  const navigateToSuccess = (currentOrder: Order) => {
    navigate('/success', { 
      state: { 
        order: currentOrder,
        has_whatsapp_support: hasWhatsappSupport || product?.has_whatsapp_support || false,
        whatsapp_number: whatsappNumber || product?.whatsapp_number || ''
      }
    });
  };

  // Navigate to retry-payment page with appropriate props
  const navigateToRetryPayment = (currentOrder: Order) => {
    navigate('/retry-payment', { 
      state: { 
        order: currentOrder,
        autoRetry: true
      }
    });
  };

  // Check if order already has a terminal status
  const handleInitialOrderStatus = (currentOrder: Order): boolean => {
    // If payment status is a failure, redirect to retry-payment
    if (currentOrder.status && FAILURE_STATUSES.includes(currentOrder.status as PaymentStatus)) {
      console.log('[PaymentAnalysis] Order already marked as failed, redirecting to retry-payment page');
      navigateToRetryPayment(currentOrder);
      return true;
    }

    // If payment status is success, redirect to success
    if (currentOrder.status && SUCCESS_STATUSES.includes(currentOrder.status as PaymentStatus)) {
      console.log('[PaymentAnalysis] Order already confirmed, redirecting to success page');
      navigateToSuccess(currentOrder);
      return true;
    }

    return false;
  };

  // Start payment status polling
  const startPolling = (currentOrder: Order) => {
    // Skip polling for temporary payment IDs and simulate success after delay
    if (currentOrder.asaasPaymentId && 
        (currentOrder.asaasPaymentId.startsWith('temp_') || 
         currentOrder.asaasPaymentId.startsWith('temp_retry_'))) {
      console.log('[PaymentAnalysis] Using temporary ID, proceeding to success after delay');
      
      // Short delay to allow for simulation time
      setTimeout(() => {
        navigateToSuccess(currentOrder);
      }, 2000);
      return null; // Return null to indicate no interval was created
    }
    
    // Start polling interval for real payment IDs
    const pollingInterval = setInterval(async () => {
      try {
        const newCount = checkCount + 1;
        setCheckCount(newCount);
        
        // Check if we've reached max checks
        if (newCount >= maxChecks) {
          clearInterval(pollingInterval);
          console.log('[PaymentAnalysis] Max checks reached, navigating to success');
          navigateToSuccess(currentOrder);
          return;
        }
        
        // First check status in our database
        try {
          const refreshedOrder = await fetchOrderById(currentOrder.id);
          
          if (refreshedOrder && FAILURE_STATUSES.includes(refreshedOrder.status as PaymentStatus)) {
            clearInterval(pollingInterval);
            console.log('[PaymentAnalysis] Order status updated to failed in database');
            navigateToRetryPayment(refreshedOrder);
            return;
          }
          
          // If status has been updated to confirmed, go to success page
          if (refreshedOrder && SUCCESS_STATUSES.includes(refreshedOrder.status as PaymentStatus)) {
            clearInterval(pollingInterval);
            console.log('[PaymentAnalysis] Order confirmed in database, navigating to success');
            navigateToSuccess(refreshedOrder);
            return;
          }
        } catch (err) {
          console.error('[PaymentAnalysis] Error checking order status in database:', err);
        }
        
        // Only check payment status in Asaas if we have a valid payment ID (not temp)
        if (currentOrder.asaasPaymentId && 
            !currentOrder.asaasPaymentId.startsWith('temp_') && 
            !currentOrder.asaasPaymentId.startsWith('temp_retry_')) {
            
          const status = await checkPaymentStatus(currentOrder.asaasPaymentId);
          console.log(`[PaymentAnalysis] Payment status check #${newCount}:`, status);
          
          // If payment status is now CONFIRMED, navigate to success
          if (typeof status === 'string' && SUCCESS_STATUSES.includes(status as PaymentStatus)) {
            clearInterval(pollingInterval);
            navigateToSuccess(currentOrder);
            return;
          }
          
          // If payment status is FAILED, CANCELLED, or DECLINED, navigate to retry-payment
          if (typeof status === 'string' && FAILURE_STATUSES.includes(status as PaymentStatus)) {
            clearInterval(pollingInterval);
            // Redirect to the retry-payment page with autoRetry flag
            navigateToRetryPayment({
              ...currentOrder,
              status: status // Update the status to the current value
            });
            return;
          }
        } else {
          console.log('[PaymentAnalysis] Using temporary ID, waiting for backend update: ' + currentOrder.asaasPaymentId);
        }
      } catch (error) {
        console.error('[PaymentAnalysis] Error checking payment status:', error);
      }
    }, 3000); // Check every 3 seconds
    
    return pollingInterval;
  };

  // Initial data loading effect
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        let currentOrder = null;

        // First try to get order from initialOrder prop
        if (initialOrder) {
          console.log('[PaymentAnalysis] Using order from props:', initialOrder);
          currentOrder = initialOrder;
          
          // Check if order already has terminal status
          if (handleInitialOrderStatus(currentOrder)) {
            return; // Order has been processed, no need to continue
          }
        } else {
          // Otherwise try to get from URL parameters
          const orderId = getOrderIdFromUrl();
          
          if (!orderId) {
            console.error('[PaymentAnalysis] No order ID found');
            throw new Error("Order ID not found");
          }
          
          console.log('[PaymentAnalysis] Fetching order with ID:', orderId);
          currentOrder = await fetchOrderById(orderId);
          
          if (!currentOrder) {
            console.error('[PaymentAnalysis] Order not found with ID:', orderId);
            throw new Error("Order not found");
          }
          
          // Check if order already has terminal status
          if (handleInitialOrderStatus(currentOrder)) {
            return; // Order has been processed, no need to continue
          }
        }
        
        setOrder(currentOrder);
        
        // Start polling for payment status
        const interval = startPolling(currentOrder);
        
        // Cleanup interval on unmount
        return () => {
          if (interval) clearInterval(interval);
        };
      } catch (error) {
        logPaymentError('PaymentAnalysis', error, 'Error loading order data');
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pedido",
          variant: "destructive",
        });
        
        // Navigate to homepage on error
        setTimeout(() => {
          navigate('/', {
            state: {
              errorMessage: "Falha ao processar pagamento. Tente novamente."
            }
          });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderData();
  }, [initialOrder, navigate, toast, fetchOrderById, getOrderIdFromUrl, checkCount, hasWhatsappSupport, whatsappNumber, product]);

  return { order, loading };
};
