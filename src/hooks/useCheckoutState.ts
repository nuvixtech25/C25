
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
        // Para cartão de crédito, sempre redirecionar para análise de pagamento
        console.log('[useCheckoutState] Navigating to payment analysis page');
                
        // Extract only serializable data for navigation
        const safeOrderData = currentOrder ? {
          id: currentOrder.id,
          customerId: currentOrder.customerId || '',
          customerName: currentOrder.customerName || 'Cliente Anônimo',
          customerEmail: currentOrder.customerEmail || 'anonimo@example.com',
          customerCpfCnpj: currentOrder.customerCpfCnpj || '',
          customerPhone: currentOrder.customerPhone || '',
          productId: currentOrder.productId || '',
          productName: currentOrder.productName || '',
          productPrice: currentOrder.productPrice || 0,
          status: currentOrder.status || 'PENDING',
          paymentMethod: currentOrder.paymentMethod || 'creditCard',
          createdAt: currentOrder.createdAt,
          updatedAt: currentOrder.updatedAt
        } : null;
        
        const productInfo = {
          has_whatsapp_support: !!product.has_whatsapp_support,
          whatsapp_number: typeof product.whatsapp_number === 'string' ? product.whatsapp_number : '',
          type: product.type || 'physical'
        };
        
        // Adding a small delay to ensure smooth navigation
        setTimeout(() => {
          navigate('/payment-analysis', { 
            state: { 
              order: safeOrderData,
              billingData,
              product: productInfo
            } 
          });
        }, 500);
      }
    } catch (error) {
      handleApiError(error, {
        toast,
        defaultMessage: "Ocorreu um erro ao processar o pagamento. Tente novamente."
      });
      
      // Create a simple serializable version of the order
      const safeOrderData = currentOrder ? {
        id: currentOrder.id,
        customerName: currentOrder.customerName || 'Cliente Anônimo',
        customerEmail: currentOrder.customerEmail || 'anonimo@example.com',
        productName: currentOrder.productName || '',
        productPrice: currentOrder.productPrice || 0
      } : null;
      
      // Adding orderId to URL params as a fallback mechanism
      const failedUrl = currentOrder ? 
        `/failed?orderId=${currentOrder.id}` : 
        '/failed';
      
      // Navigate to failed page, including orderId in URL and pass the order object in state
      navigate(failedUrl, {
        state: {
          order: safeOrderData
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
