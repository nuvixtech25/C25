
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
      setTimeout(() => navigate('/'), 1500);
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
        
        // Update the order with the Asaas payment ID if it was generated
        if (data.paymentId && orderData.id) {
          try {
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
          } catch (updateError) {
            console.error('Exception updating order with Asaas payment ID:', updateError);
          }
        }
        
        // Ensure the payment data has all required fields
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
        
        // Debug what data was received for QR code
        console.log("QR Code Image:", safePaymentData.qrCodeImage ? `Received (${safePaymentData.qrCodeImage.substring(0, 30)}...)` : "Not received");
        console.log("QR Code:", safePaymentData.qrCode ? `Received (${safePaymentData.qrCode.substring(0, 30)}...)` : "Not received");
        console.log("Copy Paste Key:", safePaymentData.copyPasteKey ? `Received (${safePaymentData.copyPasteKey.substring(0, 30)}...)` : "Not received");
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
  
  return { loading, paymentData, order, error };
};
