import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRetryValidation } from '@/hooks/useRetryValidation';
import { Order, PaymentMethod, PaymentStatus } from '@/types/checkout';

export const useRetryPaymentData = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState<{
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null>(null);
  
  // State for tracking WhatsApp support - keeping this to maintain compatibility
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const { validateRetryAttempt, isValidating } = useRetryValidation();

  // Fetch order data if not provided in location state
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // If order is provided in location state, use it
        if (state?.order) {
          setOrder(state.order);
          checkRetryLimit(state.order.id);
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
        const orderData = {
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
        };
        
        setOrder(orderData);
        checkRetryLimit(orderData.id);
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

  // Handle WhatsApp data
  useEffect(() => {
    if (order) {
      if (state && state.product) {
        const productData = state.product;
        setHasWhatsappSupport(Boolean(productData.has_whatsapp_support));
        setWhatsappNumber(productData.whatsapp_number || '');
        console.log('[RetryPaymentPage] Set WhatsApp data from state:', {
          hasSupport: Boolean(productData.has_whatsapp_support),
          number: productData.whatsapp_number || ''
        });
      } else {
        try {
          const storedSupport = localStorage.getItem('whatsapp_support');
          const storedNumber = localStorage.getItem('whatsapp_number');
          
          console.log('[RetryPaymentPage] Checking localStorage for WhatsApp data:', {
            storedSupport,
            storedNumber
          });
          
          if (storedSupport === 'true') {
            setHasWhatsappSupport(true);
          }
          
          if (storedNumber) {
            setWhatsappNumber(storedNumber);
          }
        } catch (e) {
          console.error('[RetryPaymentPage] Failed to read from localStorage:', e);
        }
      }
    }
  }, [order, state]);

  // Check if we can retry payment
  const checkRetryLimit = async (orderId: string) => {
    try {
      if (!orderId) return;
      
      const result = await validateRetryAttempt(orderId, {
        maxAttempts: 3,
        minMinutes: 5,
        enforceDelay: false // Por enquanto, não bloqueamos por tempo
      });
      
      setValidationResult(result);
      
      if (!result.canProceed) {
        toast({
          title: "Limite atingido",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking retry limit:", error);
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
    checkRetryLimit
  };
};
