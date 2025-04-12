import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRetryValidation } from '@/hooks/useRetryValidation';
import { Order, PaymentMethod, PaymentStatus, Product } from '@/types/checkout';
import { fetchProductBySlug } from '@/services/productService';

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
  
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const { validateRetryAttempt, isValidating } = useRetryValidation();

  // Fetch order data if not provided in location state
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        let orderData: Order | null = null;
        let productData: Product | null = null;

        // If order is provided in location state, use it
        if (state?.order) {
          orderData = state.order;
        } else {
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
          orderData = {
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
        }

        // Fetch product data to get WhatsApp information
        if (orderData?.productId) {
          const { data: productResult, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', orderData.productId)
            .single();

          if (!productError && productResult) {
            productData = {
              id: productResult.id,
              name: productResult.name,
              description: productResult.description || '',
              price: Number(productResult.price),
              type: productResult.type === 'digital' ? 'digital' : 'physical',
              has_whatsapp_support: productResult.has_whatsapp_support || false,
              whatsapp_number: productResult.whatsapp_number || undefined
            };

            // Attach WhatsApp data to order
            orderData = {
              ...orderData,
              has_whatsapp_support: productData.has_whatsapp_support,
              whatsapp_number: productData.whatsapp_number
            };
          }
        }

        setOrder(orderData);
        
        // Set WhatsApp support data
        const supportEnabled = productData?.has_whatsapp_support || false;
        const supportNumber = productData?.whatsapp_number || '';
        
        setHasWhatsappSupport(supportEnabled);
        setWhatsappNumber(supportNumber);
        
        // Check retry limit
        if (orderData?.id) {
          checkRetryLimit(orderData.id);
        }
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
