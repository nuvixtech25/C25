
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleApiError } from '@/utils/errorHandling';
import { BillingData, PixPaymentData, Order } from '@/types/checkout';
import { generatePixPayment } from '@/services/asaasService';

export const usePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PixPaymentData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.group('PaymentPage Hook Debug');
    console.log("Location state:", location.state);
    console.log("Initial states:", { loading, paymentData, order, error });
    
    const billingData = location.state?.billingData as BillingData;
    const orderData = location.state?.order as Order;
    
    console.log("Billing Data:", billingData);
    console.log("Order Data:", orderData);
    
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
      setTimeout(() => navigate('/'), 1500);
      console.groupEnd();
      return;
    }
    
    setOrder(orderData);
    
    const fetchPixPayment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Generating PIX payment for order:", orderData.id);
        
        const formattedBillingData = {
          customer: {
            name: billingData.customer?.name || '',
            cpfCnpj: (billingData.customer?.cpfCnpj || '').replace(/[^0-9]/g, ''),
            email: billingData.customer?.email || '',
            phone: (billingData.customer?.phone || '').replace(/[^0-9]/g, '')
          },
          orderId: orderData.id || billingData.orderId || `ordem-${Date.now()}`,
          value: parseFloat(String(billingData.value)) || 0,
          description: billingData.description || `Pedido ${orderData.id || 'novo'}`
        };
        
        console.log("Formatted billing data:", formattedBillingData);
        
        const data = await generatePixPayment(formattedBillingData);
        console.log("Payment data received:", data);
        
        const safePaymentData = {
          ...data,
          qrCodeImage: data.qrCodeImage || '',
          qrCode: data.qrCode || '',
          copyPasteKey: data.copyPasteKey || '',
          expirationDate: data.expirationDate || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          paymentId: data.paymentId || data.payment?.id || '',
          value: parseFloat(String(data.value)) || formattedBillingData.value,
          description: data.description || formattedBillingData.description
        };
        
        setPaymentData(safePaymentData);
        
        console.log("Payment data set:", safePaymentData);
        
        console.groupEnd();
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
        
        console.groupEnd();
      } finally {
        setLoading(false);
      }
    };
    
    fetchPixPayment();
  }, [location.state, navigate, toast]);
  
  return { loading, paymentData, order, error };
};

