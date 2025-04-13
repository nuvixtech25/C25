
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { useOrderData } from '@/hooks/useOrderData';
import { useToast } from '@/hooks/use-toast';
import FailedPageHeader from '@/components/failed-payment/FailedPageHeader';
import FailureReasons from '@/components/failed-payment/FailureReasons';
import RetryPaymentButton from '@/components/failed-payment/RetryPaymentButton';
import { logPaymentError } from '@/utils/paymentErrorHandler';

const FailedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { order, setOrder, loading, setLoading, fetchOrderById, getOrderIdFromUrl } = useOrderData();
  const { trackPurchase } = usePixelEvents();
  const { toast } = useToast();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Clear any WhatsApp data from localStorage to prevent it from being used
    try {
      localStorage.removeItem('whatsapp_support');
      localStorage.removeItem('whatsapp_number');
    } catch (e) {
      logPaymentError('FailedPage', e, 'Failed to clear localStorage');
    }
    
    console.log('[FailedPage] Full location state:', state);
    
    const loadOrderData = async () => {
      // Prevent infinite redirects
      if (hasRedirected) {
        return;
      }
      
      // If we have order in state, use it
      if (state?.order) {
        console.log('[FailedPage] Order found in location state:', state.order);
        setOrder(state.order);
        
        // Track failed purchase
        if (state.order.id && state.order.productPrice) {
          trackPurchase(state.order.id, 0); // Value 0 for failed payment
        }
        return;
      }
      
      console.log('[FailedPage] No order found in location state');
      
      // Try to get orderId from URL query params if not in state
      const orderId = getOrderIdFromUrl();
      if (orderId) {
        try {
          const fetchedOrder = await fetchOrderById(orderId);
          
          if (fetchedOrder) {
            setOrder(fetchedOrder);
            
            // Track failed purchase
            if (fetchedOrder.id && fetchedOrder.productPrice) {
              trackPurchase(fetchedOrder.id, 0); // Value 0 for failed payment
            }
          } else {
            handleMissingOrder();
          }
        } catch (error) {
          logPaymentError('FailedPage', error, 'Error fetching order by ID');
          handleMissingOrder();
        }
      } else {
        console.log('[FailedPage] No order found in location state and no orderId in URL');
        handleMissingOrder();
      }
    };
    
    const handleMissingOrder = () => {
      if (!hasRedirected) {
        setHasRedirected(true);
        toast({
          title: "Pedido não encontrado",
          description: "Não foi possível identificar seu pedido.",
          variant: "destructive",
        });
        
        // Use setTimeout to delay the navigation slightly to allow the toast to be seen
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    };
    
    loadOrderData();
  }, [state, getOrderIdFromUrl, fetchOrderById, setOrder, toast, trackPurchase, navigate, hasRedirected]);

  // Debug logs to help troubleshoot the issue
  useEffect(() => {
    console.log('[FailedPage] Current order state:', order);
  }, [order]);

  // If we've already redirected, don't render the component
  if (hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-red-50">
      <Card className="max-w-md w-full shadow-xl border border-red-100 rounded-xl overflow-hidden">
        <div className="bg-red-500 h-2 w-full" />
        <FailedPageHeader />
        
        <CardContent className="text-center space-y-4 px-6 py-6">
          <FailureReasons />
          
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pb-8">
          {!loading && order && (
            <RetryPaymentButton order={order} isLoading={loading} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailedPage;
