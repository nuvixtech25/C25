
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, XCircle, CreditCard } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/checkout';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FailedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { trackPurchase } = usePixelEvents();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any WhatsApp data from localStorage to prevent it from being used
    try {
      localStorage.removeItem('whatsapp_support');
      localStorage.removeItem('whatsapp_number');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
    
    console.log('[FailedPage] Full location state:', state);
    
    const fetchOrderData = async () => {
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
      const orderId = searchParams.get('orderId');
      if (orderId) {
        setLoading(true);
        try {
          console.log('[FailedPage] Fetching order with ID:', orderId);
          
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
            
          if (error) {
            console.error('[FailedPage] Error fetching order:', error);
            toast({
              title: "Erro ao carregar pedido",
              description: "Não foi possível recuperar os dados do seu pedido.",
              variant: "destructive",
            });
            return;
          }
          
          if (data) {
            const fetchedOrder: Order = {
              id: data.id,
              customerId: data.customer_id,
              customerName: data.customer_name,
              customerEmail: data.customer_email,
              customerCpfCnpj: data.customer_cpf_cnpj,
              customerPhone: data.customer_phone,
              productId: data.product_id,
              productName: data.product_name,
              productPrice: data.product_price,
              status: data.status,
              paymentMethod: data.payment_method,
              asaasPaymentId: data.asaas_payment_id,
              createdAt: data.created_at,
              updatedAt: data.updated_at
            };
            
            console.log('[FailedPage] Fetched order from database:', fetchedOrder);
            setOrder(fetchedOrder);
            
            // Track failed purchase
            if (fetchedOrder.id && fetchedOrder.productPrice) {
              trackPurchase(fetchedOrder.id, 0); // Value 0 for failed payment
            }
          }
        } catch (error) {
          console.error('[FailedPage] Error in fetchOrderData:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('[FailedPage] No order found in location state and no orderId in URL');
      }
    };
    
    fetchOrderData();
  }, [state, searchParams, trackPurchase, toast]);

  // Debug logs to help troubleshoot the issue
  useEffect(() => {
    console.log('[FailedPage] Current order state:', order);
  }, [order]);

  const handleRetry = () => {
    if (order && order.id) {
      console.log('[FailedPage] Navigating to retry-payment with order ID:', order.id);
      navigate(`/retry-payment?orderId=${order.id}`, { state: { order } });
    } else {
      console.error('[FailedPage] No order available for retry');
      toast({
        title: "Erro",
        description: "Não foi possível recuperar os dados do pedido para tentar novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-red-50">
      <Card className="max-w-md w-full shadow-xl border border-red-100 rounded-xl overflow-hidden">
        <div className="bg-red-500 h-2 w-full" />
        <CardHeader className="text-center pt-8">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Pagamento não aprovado</CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            Houve um problema com seu pagamento
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-6">
          <p className="text-gray-700">Seu pagamento não foi autorizado pela operadora do cartão. Isso pode ocorrer por diversos motivos:</p>
          
          <div className="bg-red-50 rounded-lg border border-red-100 p-4 my-4">
            <div className="flex flex-col space-y-3 text-left">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Cartão com limite insuficiente</strong> - Verifique se há saldo disponível</p>
              </div>
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Dados incorretos</strong> - Confira se todos os dados foram digitados corretamente</p>
              </div>
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Cartão bloqueado</strong> - Entre em contato com seu banco</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 my-4 animate-pulse-slow">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
              <p className="text-amber-700 font-medium">Não tente novamente com o mesmo cartão! O problema persistirá.</p>
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pb-8">
          {!loading && (
            <Button 
              onClick={handleRetry} 
              className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-md transition-all duration-300 py-6 h-auto text-base font-medium rounded-xl"
              variant="default"
            >
              <RefreshCcw className="h-5 w-5" />
              Tentar com outro cartão
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailedPage;
