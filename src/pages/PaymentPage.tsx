
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BillingData, PixPaymentData, Order, PaymentStatus } from '@/types/checkout';
import { generatePixPayment } from '@/services/asaasService';
import { PixPayment } from '@/components/checkout/payment-methods/PixPayment';
import { ArrowLeft, ShieldCheck, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorHandling';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckoutError } from '@/components/checkout/CheckoutError';
import { usePixelEvents } from '@/hooks/usePixelEvents';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { trackPurchase } = usePixelEvents();
  
  useEffect(() => {
    // Debug the location state
    console.log("PaymentPage - Location state:", location.state);
    
    const billingData = location.state?.billingData as BillingData;
    const orderData = location.state?.order as Order;
    
    if (!billingData || !orderData) {
      console.error("Missing required data for payment page", { 
        hasBillingData: !!billingData, 
        hasOrderData: !!orderData 
      });
      
      toast({
        title: "Erro",
        description: "Informações de pagamento não encontradas. Por favor, volte e tente novamente.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setOrder(orderData);
    console.log("Order data set:", orderData);
    
    const fetchPixPayment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Generating PIX payment for order:", orderData.id);
        
        // Make sure we have all required fields properly formatted
        const formattedBillingData = {
          customer: {
            name: billingData.customer.name,
            cpfCnpj: billingData.customer.cpfCnpj?.replace(/[^0-9]/g, ''),
            email: billingData.customer.email,
            phone: billingData.customer.phone?.replace(/[^0-9]/g, '')
          },
          orderId: orderData.id || billingData.orderId,
          value: billingData.value,
          description: billingData.description || `Pedido ${orderData.id}`
        };
        
        console.log("Formatted billing data:", formattedBillingData);
        
        const data = await generatePixPayment(formattedBillingData);
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
        
        // Debug what data was received for QR code
        console.log("QR Code Image:", data.qrCodeImage ? `Received (${data.qrCodeImage.substring(0, 30)}...)` : "Not received");
        console.log("QR Code:", data.qrCode ? `Received (${data.qrCode.substring(0, 30)}...)` : "Not received");
        console.log("Copy Paste Key:", data.copyPasteKey ? `Received (${data.copyPasteKey.substring(0, 30)}...)` : "Not received");
      } catch (error) {
        console.error("Error generating payment:", error);
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
  
  // Debug what's being rendered
  console.log("Rendering PaymentPage:", { 
    loading, 
    hasPaymentData: !!paymentData, 
    hasOrder: !!order, 
    error 
  });
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-asaas-primary/5 via-asaas-secondary/10 to-purple-100/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-purple-100/5 via-asaas-secondary/10 to-asaas-primary/5 pointer-events-none"></div>
      
      {/* Floating circles for decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-asaas-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-asaas-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex items-center text-xs bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
          <ShieldCheck className="h-4 w-4 mr-1.5 text-asaas-primary" />
          <span className="text-gray-700 font-medium">Pagamento Seguro</span>
        </div>
      </div>
      
      {loading ? (
        <div className="w-full max-w-md h-64 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
          <LoadingSpinner message="Gerando pagamento PIX..." />
        </div>
      ) : error ? (
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center border border-red-100">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium text-lg mb-2">Erro ao gerar pagamento</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={() => navigate('/')} 
            className="mt-2 bg-asaas-primary hover:bg-asaas-secondary transition-colors"
          >
            Tentar novamente
          </Button>
        </div>
      ) : (paymentData && order) ? (
        <div className="animate-fade-in w-full max-w-md">
          <PixPayment 
            orderId={order.id || ''} 
            qrCode={paymentData.qrCode || ''}
            qrCodeImage={paymentData.qrCodeImage || ''}
            copyPasteKey={paymentData.copyPasteKey || ''}
            expirationDate={paymentData.expirationDate || new Date().toISOString()}
            value={paymentData.value || 0}
            description={paymentData.description || ''}
            paymentId={paymentData.paymentId || ''}
          />
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            </div>
            <p className="text-sm text-gray-600">
              "Compra super fácil e rápida! Recomendo!"
            </p>
            <p className="text-xs text-gray-500 mt-1">— Maria S.</p>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500 flex flex-col items-center">
            <p className="mb-2">Se precisar de ajuda, entre em contato com nosso suporte</p>
            <p>© {new Date().getFullYear()} Asaas Payments</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md h-64 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium text-lg mb-2">Dados de pagamento incompletos</p>
            <p className="text-sm text-muted-foreground mb-4">
              Não foi possível carregar os dados necessários para o pagamento.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-2 bg-asaas-primary hover:bg-asaas-secondary transition-colors"
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
