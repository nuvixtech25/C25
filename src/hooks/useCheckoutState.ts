
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product, CreditCardData } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { handleApiError } from '@/utils/errorHandling';
import { getAsaasConfig } from '@/services/asaasConfigService';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData, saveCardData } = useCheckoutOrder();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async (paymentData?: CreditCardData, existingOrderId?: string) => {
    // Continue even without customer data
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      let order;
      let billingData;
      
      if (existingOrderId) {
        const { data, error } = await fetch(`/api/orders/${existingOrderId}`).then(res => res.json());
        if (error) throw new Error(error.message);
        order = data;
        
        // Update the payment data for the existing order
        if (paymentData) {
          await saveCardData(existingOrderId, paymentData);
        }
        
        // Prepare billing data
        billingData = {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpfCnpj: order.customerCpfCnpj,
            phone: order.customerPhone
          },
          value: order.productPrice,
          description: order.productName,
          orderId: existingOrderId
        };
      } else {
        // If we don't have customer data, use placeholder data
        const defaultCustomerData: CustomerData = customerData || {
          name: "Cliente Anônimo",
          email: "anonimo@example.com",
          cpfCnpj: "00000000000",
          phone: "00000000000"
        };
        
        // Create a new order with the customer data we have (or the placeholder)
        order = await createOrder(defaultCustomerData, product, paymentMethod, paymentData);
        billingData = prepareBillingData(defaultCustomerData, product, order.id as string);
      }
      
      if (paymentMethod === 'pix') {
        navigate('/payment', { 
          state: { 
            billingData, 
            order,
            product: {
              has_whatsapp_support: product.has_whatsapp_support,
              whatsapp_number: product.whatsapp_number,
              type: product.type || 'physical'
            }
          } 
        });
      } else {
        // Handle credit card payment with admin configuration
        const config = await getAsaasConfig();
        const redirectPage = config?.manual_card_redirect_page || '/payment-pending';
        
        console.log('[useCheckoutState] Navigating to configured page:', redirectPage);
        console.log('[useCheckoutState] With WhatsApp data:', {
          has_whatsapp_support: product.has_whatsapp_support,
          whatsapp_number: product.whatsapp_number
        });
        
        // Adding a small delay to ensure smooth navigation
        setTimeout(() => {
          navigate(redirectPage, { 
            state: { 
              order,
              billingData,
              product: {
                has_whatsapp_support: product.has_whatsapp_support,
                whatsapp_number: product.whatsapp_number,
                type: product.type || 'physical'
              }
            } 
          });
        }, 500);
      }
    } catch (error) {
      handleApiError(error, {
        toast,
        defaultMessage: "Ocorreu um erro ao processar o pagamento. Tente novamente."
      });
      
      // Store the current orderId to use for navigation
      let orderId: string | undefined;
      
      // Here we need to be more defensive - we need to check if a created order exists
      try {
        // Try to safely access order.id if it was defined during the try block
        // @ts-ignore - Using optional chaining to be safe
        orderId = order?.id;
      } catch (err) {
        // If there's any error accessing order.id, just leave orderId as undefined
        console.error("Error accessing order ID:", err);
      }
      
      // Navigate to failed page, including orderId if available AND pass the order object in state
      if (orderId) {
        console.log('[useCheckoutState] Redirecting to failed page with order ID:', orderId);
        console.log('[useCheckoutState] Order object:', order);
        
        navigate(`/failed`, {
          state: {
            order,
            autoRetry: true
          }
        });
      } else {
        // Even without orderId, we should pass any available order data
        navigate('/failed', {
          state: {
            order,
            autoRetry: true
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  };
};
