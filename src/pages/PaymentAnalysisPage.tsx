
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrderData } from '@/hooks/useOrderData';
import { checkPaymentStatus } from '@/services/asaasService';
import { Order, PaymentStatus } from '@/types/checkout';
import { logPaymentError } from '@/utils/paymentErrorHandler';

const PaymentAnalysisPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { order: storedOrder, fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const maxChecks = 10; // Máximo de verificações antes de redirecionar

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        let currentOrder = null;

        // First try to get order from location state
        if (state?.order) {
          console.log('[PaymentAnalysisPage] Using order from state:', state.order);
          currentOrder = state.order;
        } else {
          // Otherwise try to get from URL parameters
          const orderId = getOrderIdFromUrl();
          
          if (!orderId) {
            console.error('[PaymentAnalysisPage] No order ID found');
            throw new Error("Order ID not found");
          }
          
          console.log('[PaymentAnalysisPage] Fetching order with ID:', orderId);
          currentOrder = await fetchOrderById(orderId);
          
          if (!currentOrder) {
            console.error('[PaymentAnalysisPage] Order not found with ID:', orderId);
            throw new Error("Order not found");
          }
        }
        
        setOrder(currentOrder);
        
        // Check if the order status is declined or failed directly from the order object
        if (currentOrder.status === 'DECLINED' || currentOrder.status === 'FAILED' || 
            currentOrder.status === 'CANCELLED') {
          console.log('[PaymentAnalysisPage] Order already marked as failed/declined/cancelled, redirecting to failed page');
          
          navigate('/failed', { 
            state: { 
              order: currentOrder,
              autoRetry: true
            }
          });
          return;
        }
        
        // Check if payment ID exists, if not or starts with temp_, proceed directly to success page
        if (!currentOrder.asaasPaymentId || 
            currentOrder.asaasPaymentId.startsWith('temp_') || 
            currentOrder.asaasPaymentId.startsWith('temp_retry_')) {
          console.log('[PaymentAnalysisPage] Using temporary payment ID or no payment ID, proceeding to success');
          // Wait 2 seconds before redirecting for better UX
          setTimeout(() => {
            navigate('/success', { 
              state: { 
                order: currentOrder,
                has_whatsapp_support: state?.hasWhatsappSupport || state?.product?.has_whatsapp_support || false,
                whatsapp_number: state?.whatsappNumber || state?.product?.whatsapp_number || ''
              }
            });
          }, 2000);
          return;
        }
        
        // Start polling for payment status
        const pollingInterval = setInterval(async () => {
          try {
            const newCount = checkCount + 1;
            setCheckCount(newCount);
            
            // Check if we've reached max checks
            if (newCount >= maxChecks) {
              clearInterval(pollingInterval);
              console.log('[PaymentAnalysisPage] Max checks reached, navigating to success');
              navigate('/success', { 
                state: { 
                  order: currentOrder,
                  has_whatsapp_support: state?.hasWhatsappSupport || state?.product?.has_whatsapp_support || false,
                  whatsapp_number: state?.whatsappNumber || state?.product?.whatsapp_number || ''
                }
              });
              return;
            }
            
            // First check status in our database
            try {
              const refreshedOrder = await fetchOrderById(currentOrder.id);
              if (refreshedOrder && 
                  (refreshedOrder.status === 'DECLINED' || 
                   refreshedOrder.status === 'FAILED' || 
                   refreshedOrder.status === 'CANCELLED')) {
                clearInterval(pollingInterval);
                console.log('[PaymentAnalysisPage] Order status updated to failed/declined/cancelled in database');
                navigate('/failed', { 
                  state: { 
                    order: refreshedOrder,
                    autoRetry: true
                  }
                });
                return;
              }
            } catch (err) {
              console.error('[PaymentAnalysisPage] Error checking order status in database:', err);
            }
            
            // Check payment status in Asaas
            const status = await checkPaymentStatus(currentOrder.asaasPaymentId);
            console.log(`[PaymentAnalysisPage] Payment status check #${newCount}:`, status);
            
            // If payment status is now CONFIRMED, navigate to success
            if (status === 'CONFIRMED') {
              clearInterval(pollingInterval);
              navigate('/success', { 
                state: { 
                  order: currentOrder,
                  has_whatsapp_support: state?.hasWhatsappSupport || state?.product?.has_whatsapp_support || false,
                  whatsapp_number: state?.whatsappNumber || state?.product?.whatsapp_number || ''
                }
              });
              return;
            }
            
            // If payment status is FAILED, CANCELLED, or DECLINED, navigate to failed
            if (status === 'FAILED' || status === 'CANCELLED' || status === 'DECLINED') {
              clearInterval(pollingInterval);
              // Redirect to the failed page with autoRetry flag to trigger immediate retry
              navigate('/failed', { 
                state: { 
                  order: currentOrder,
                  autoRetry: true
                }
              });
              return;
            }
          } catch (error) {
            console.error('[PaymentAnalysisPage] Error checking payment status:', error);
          }
        }, 3000); // Check every 3 seconds
        
        // Cleanup interval on unmount
        return () => clearInterval(pollingInterval);
      } catch (error) {
        logPaymentError('PaymentAnalysisPage', error, 'Error loading order data');
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
  }, [state, navigate, toast, fetchOrderById, getOrderIdFromUrl, checkCount]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <Card className="max-w-md w-full shadow-xl border border-purple-100 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 w-full" />
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-yellow-100">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Analisando pagamento</h2>
          <p className="text-gray-600 text-lg mt-2">
            Seu pagamento está sendo processado. Por favor, aguarde.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="flex items-center justify-center my-8">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Isso pode levar alguns instantes.</p>
            <p>Não recarregue nem feche esta página.</p>
          </div>
          
          {order && (
            <div className="w-full mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Pedido #{order.id}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentAnalysisPage;
