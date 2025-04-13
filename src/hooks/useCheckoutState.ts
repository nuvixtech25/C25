
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CustomerData, PaymentMethod, Product, CreditCardData } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { handleApiError } from '@/utils/errorHandling';

export const useCheckoutState = (product: Product | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData, saveCardData } = useCheckoutOrder();
  
  const handleCustomerSubmit = (data: CustomerData) => {
    console.log('Customer data submitted:', data);
    
    // Validate customer data
    if (!data.name || !data.email || !data.cpfCnpj || !data.phone) {
      console.error('Missing required customer data fields');
      return;
    }
    
    // Store customer data in state for later use
    setCustomerData(data);
  };
  
  const handlePaymentSubmit = async (paymentData?: CreditCardData, existingOrderId?: string) => {
    if (!product) {
      console.error('Missing product data');
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we have customer data in state before proceeding
    if (!customerData || !customerData.name || !customerData.email || !customerData.cpfCnpj || !customerData.phone) {
      console.error('Missing customer data');
      toast({
        title: "Erro",
        description: "Por favor, preencha seus dados pessoais",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Processing payment with customer data:", customerData);
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
        // Use the customer data that was collected
        console.log('Using customer data for order:', customerData);
        
        // Create a new order with the customer data we have
        currentOrder = await createOrder(customerData, product, paymentMethod, paymentData);
        orderId = currentOrder.id as string;
        billingData = prepareBillingData(customerData, product, orderId);
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
          customerName: currentOrder.customerName || customerData.name,
          customerEmail: currentOrder.customerEmail || customerData.email,
          customerCpfCnpj: currentOrder.customerCpfCnpj || customerData.cpfCnpj,
          customerPhone: currentOrder.customerPhone || customerData.phone,
          productId: currentOrder.productId || '',
          productName: currentOrder.productName || '',
          productPrice: currentOrder.productPrice || 0,
          status: currentOrder.status || 'PENDING',
          paymentMethod: currentOrder.paymentMethod || 'creditCard',
          asaasPaymentId: currentOrder.asaasPaymentId || '',
          createdAt: currentOrder.createdAt,
          updatedAt: currentOrder.updatedAt
        } : null;
        
        const productInfo = {
          has_whatsapp_support: !!product.has_whatsapp_support,
          whatsapp_number: typeof product.whatsapp_number === 'string' ? product.whatsapp_number : '',
          type: product.type || 'physical'
        };
        
        // Create a payment ID if safeOrderData exists and doesn't have a payment ID
        if (safeOrderData && !safeOrderData.asaasPaymentId) {
          // Generate a temporary payment ID until real one is created
          safeOrderData.asaasPaymentId = `temp_${Date.now()}`;
        }
        
        // Adding a small delay to ensure smooth navigation
        setTimeout(() => {
          // Make sure safeOrderData is not null before navigating
          if (safeOrderData) {
            navigate('/payment-analysis', { 
              state: { 
                order: safeOrderData,
                billingData,
                product: productInfo
              } 
            });
          } else {
            // Handle the case where order creation failed
            throw new Error("Falha ao criar pedido");
          }
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
        customerName: currentOrder.customerName || (customerData ? customerData.name : 'Cliente Anônimo'),
        customerEmail: currentOrder.customerEmail || (customerData ? customerData.email : 'anonimo@example.com'),
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
