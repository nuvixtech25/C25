import { useNavigate } from 'react-router-dom';
import { CustomerData, Product, CreditCardData, Order, PaymentMethod } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';
import { handleApiError } from '@/utils/errorHandling';

export const usePaymentNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navigateToPayment = (
    paymentMethod: PaymentMethod,
    currentOrder: any,
    billingData: any,
    redirectPage: string,
    customerData: CustomerData | null,
    product: Product | undefined
  ) => {
    // Log para depuração
    console.log('[usePaymentNavigation] Navegando com o produto:', product);
    
    if (paymentMethod === 'pix') {
      navigate('/payment', { 
        state: { 
          billingData, 
          order: currentOrder,
          product: product ? {
            has_whatsapp_support: product.has_whatsapp_support,
            whatsapp_number: product.whatsapp_number,
            type: product.type || 'physical'
          } : undefined,
          whatsapp_number: product?.whatsapp_number || currentOrder?.whatsapp_number
        } 
      });
    } else {
      // For credit card, use the configured redirect page from the admin panel
      // BUT, ensure it's NOT /payment-failed, as that should go to /failed
      let targetPage = redirectPage;
      if (targetPage === '/payment-failed') {
        console.log(`[usePaymentNavigation] Redirecting /payment-failed to /failed`);
        targetPage = '/failed';
      } else {
        console.log(`[usePaymentNavigation] Navigating to configured redirect page: ${targetPage}`);
      }
              
      // Extract only serializable data for navigation
      const safeOrderData = currentOrder ? {
        id: currentOrder.id,
        customerId: currentOrder.customerId || '',
        customerName: currentOrder.customerName || (customerData ? customerData.name : ''),
        customerEmail: currentOrder.customerEmail || (customerData ? customerData.email : ''),
        customerCpfCnpj: currentOrder.customerCpfCnpj || (customerData ? customerData.cpfCnpj : ''),
        customerPhone: currentOrder.customerPhone || (customerData ? customerData.phone : ''),
        productId: currentOrder.productId || '',
        productName: currentOrder.productName || '',
        productPrice: currentOrder.productPrice || 0,
        status: currentOrder.status || 'PENDING',
        paymentMethod: currentOrder.paymentMethod || 'creditCard',
        asaasPaymentId: currentOrder.asaasPaymentId || '',
        createdAt: currentOrder.createdAt,
        updatedAt: currentOrder.updatedAt,
        // Adicionar dados de WhatsApp diretamente no objeto do pedido
        whatsapp_number: currentOrder.whatsapp_number || product?.whatsapp_number
      } : null;
      
      // Adiciona as informações de WhatsApp de forma mais direta no state
      setTimeout(() => {
        // Make sure safeOrderData is not null before navigating
        if (safeOrderData) {
          navigate(targetPage, { 
            state: { 
              order: safeOrderData,
              billingData,
              whatsapp_number: product?.whatsapp_number || currentOrder?.whatsapp_number,
              product: product ? {
                has_whatsapp_support: !!product.has_whatsapp_support,
                whatsapp_number: product.whatsapp_number || '',
                type: product.type || 'physical'
              } : null
            } 
          });
        } else {
          // Handle the case where order creation failed
          throw new Error("Falha ao criar pedido");
        }
      }, 500);
    }
  };
  
  const navigateToFailure = (error: any, customerData: CustomerData | null, currentOrder: any) => {
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
      productPrice: currentOrder.productPrice || 0,
      status: 'FAILED',  // Garantir que o status seja FAILED para o fluxo de falha
      paymentMethod: currentOrder.paymentMethod || 'creditCard'
    } : null;
    
    // Create a fallback order object if none was created yet
    // This ensures the failed page always has order data
    const fallbackOrderData = !safeOrderData && customerData ? {
      id: `temp_failed_${Date.now()}`,
      customerName: customerData.name || 'Cliente Anônimo',
      customerEmail: customerData.email || 'anonimo@example.com',
      customerCpfCnpj: customerData.cpfCnpj || '',
      customerPhone: customerData.phone || '',
      productName: 'Produto não identificado',
      productPrice: 0,
      status: 'FAILED',
      paymentMethod: 'creditCard'
    } : null;
    
    const orderDataToUse = safeOrderData || fallbackOrderData;
    
    console.log('[usePaymentNavigation] Navigating to failed page with order data:', orderDataToUse);
    
    // Always navigate directly to /failed regardless of redirectPage setting
    navigate('/failed', {
      state: {
        order: orderDataToUse,
        errorMessage: error?.message || "Falha no processamento do pagamento"
      }
    });
  };
  
  return {
    navigateToPayment,
    navigateToFailure
  };
};
