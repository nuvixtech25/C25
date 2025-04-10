
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BillingData, PixPaymentData, Order, PaymentStatus } from '@/types/checkout';
import { generatePixPayment } from '@/services/asaasService';
import { PixPayment } from '@/components/checkout/payment-methods/PixPayment';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorHandling';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckoutError } from '@/components/checkout/CheckoutError';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const billingData = location.state?.billingData as BillingData;
    const orderData = location.state?.order as Order;
    
    if (!billingData || !orderData) {
      toast({
        title: "Erro",
        description: "Informações de pagamento não encontradas. Por favor, volte e tente novamente.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setOrder(orderData);
    
    const fetchPixPayment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Generating PIX payment for order:", orderData.id);
        const data = await generatePixPayment(billingData);
        console.log("Payment data received:", data);
        
        // Update the order with the Asaas payment ID if it was generated
        if (data.paymentId && orderData.id) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ asaas_payment_id: data.paymentId })
            .eq('id', orderData.id);
            
          if (updateError) {
            console.error('Error updating order with Asaas payment ID:', updateError);
          } else {
            console.log('Order updated with Asaas payment ID:', data.paymentId);
            // Update the local order state with the payment ID
            setOrder(prev => prev ? { ...prev, asaasPaymentId: data.paymentId } : null);
          }
        }
        
        setPaymentData(data);
      } catch (error) {
        const errorMessage = handleApiError(error, {
          defaultMessage: "Não foi possível gerar o pagamento PIX. Por favor, tente novamente."
        });
        setError(errorMessage);
        
        toast({
          title: "Erro ao gerar pagamento",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPixPayment();
  }, [location.state, navigate, toast]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <div className="w-full max-w-md mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      {loading ? (
        <div className="w-full max-w-md h-64 flex items-center justify-center bg-white rounded-xl shadow-lg">
          <LoadingSpinner message="Gerando pagamento PIX..." />
        </div>
      ) : error ? (
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
          <p className="text-red-500 mb-2">Erro ao gerar pagamento</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={() => navigate('/')} 
            className="mt-2"
          >
            Tentar novamente
          </Button>
        </div>
      ) : (paymentData && order) ? (
        <PixPayment 
          orderId={order.id || ''} 
          qrCode={paymentData.qrCode}
          qrCodeImage={paymentData.qrCodeImage}
          copyPasteKey={paymentData.copyPasteKey}
          expirationDate={paymentData.expirationDate}
          value={paymentData.value}
          description={paymentData.description}
          paymentId={paymentData.paymentId}
        />
      ) : (
        <CheckoutError message="Erro ao carregar dados do pagamento" />
      )}
    </div>
  );
};

export default PaymentPage;
