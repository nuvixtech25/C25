
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
    
    // Define order variable outside the try block so it's accessible in catch
    let currentOrder: any = null;
    let orderId: string | undefined;
    
    try {
      let billingData;
      
      if (existingOrderId) {
        const { data, error } = await fetch(`/api/orders/${existingOrderId}`).then(res => res.json());
        if (error) throw new Error(error.message);
        currentOrder = data;
        orderId = existingOrderId;
        
        // Update the payment data for the existing order
        if (paymentData) {
          await saveCardData(existingOrderId, paymentData);
        }
        
        // Prepare billing data
        billingData = {
          customer: {
            name: currentOrder.customerName,
            email: currentOrder.customerEmail,
            cpfCnpj: currentOrder.customerCpfCnpj,
            phone: currentOrder.customerPhone
          },
          value: currentOrder.productPrice,
          description: currentOrder.productName,
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
        currentOrder = await createOrder(defaultCustomerData, product, paymentMethod, paymentData);
        orderId = currentOrder.id as string;
        billingData = prepareBillingData(defaultCustomerData, product, orderId);
      }
      
      if (paymentMethod === 'pix') {
        navigate('/payment', { 
          state: { 
            billingData, 
            order: currentOrder,
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
          // Update this to check if redirectPage is '/payment-failed' and navigate to '/failed' instead with state
          if (redirectPage === '/payment-failed') {
            navigate('/failed', { 
              state: { 
                order: currentOrder,
                // Remover autoRetry para evitar o redirecionamento automático
                // autoRetry: true,
                product: {
                  has_whatsapp_support: product.has_whatsapp_support,
                  whatsapp_number: product.whatsapp_number,
                  type: product.type || 'physical'
                }
              } 
            });
          } else {
            navigate(redirectPage, { 
              state: { 
                order: currentOrder,
                billingData,
                product: {
                  has_whatsapp_support: product.has_whatsapp_support,
                  whatsapp_number: product.whatsapp_number,
                  type: product.type || 'physical'
                }
              } 
            });
          }
        }, 500);
      }
    } catch (error) {
      handleApiError(error, {
        toast,
        defaultMessage: "Ocorreu um erro ao processar o pagamento. Tente novamente."
      });
      
      // Adding orderId to URL params as a fallback mechanism
      const failedUrl = currentOrder ? 
        `/failed?orderId=${currentOrder.id}` : 
        '/failed';
      
      // Navigate to failed page, including orderId in URL and pass the order object in state
      navigate(failedUrl, {
        state: {
          order: currentOrder,
          // Remover autoRetry para evitar o redirecionamento automático
          // autoRetry: true
        }
      });
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
