
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRetryPaymentData } from '@/hooks/useRetryPaymentData';
import { CreditCardData } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';
import { useToast } from '@/hooks/use-toast';
import { RetryPaymentLoading } from '@/components/retry-payment/RetryPaymentLoading';
import { RetryPaymentHeader } from '@/components/retry-payment/RetryPaymentHeader';
import { RetryCardSubmission } from '@/components/retry-payment/RetryCardSubmission';
import { getAsaasConfig } from '@/services/asaasConfigService';

const RetryPaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    order, 
    loading, 
    validationResult, 
    isValidating,
    hasWhatsappSupport,
    whatsappNumber,
    isSubmitting,
    setIsSubmitting,
    checkRetryLimit
  } = useRetryPaymentData();

  const { saveCardData } = useCheckoutOrder();

  // Process the card payment with proper error handling
  const handleCardSubmit = async (cardData: CreditCardData) => {
    if (!order?.id) {
      toast({
        title: "Erro",
        description: "Dados do pedido não encontrados",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('[RetryPaymentPage] Processing payment with card data for order:', order.id);
      
      // Save the card data to the database
      await saveCardData(order.id, cardData);
      
      // After saving card data, refresh the validation status
      if (checkRetryLimit) {
        await checkRetryLimit(order.id);
      }
      
      toast({
        title: "Processando pagamento",
        description: "Seu pagamento está sendo processado. Por favor, aguarde.",
      });
      
      // Get admin configuration for card redirect
      const config = await getAsaasConfig();
      // Use the configured redirect page, with fallback to payment analysis if not set
      const redirectPage = config?.manual_card_redirect_page || '/payment-pending';
      
      // Create a simplified safe order object with only serializable data
      const safeOrderData = order ? {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        productName: order.productName,
        productPrice: order.productPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      } : null;
      
      // Navigate to the configured redirect page instead of hardcoded success
      setTimeout(() => {
        navigate(redirectPage, { 
          state: { 
            order: safeOrderData,
            hasWhatsappSupport: hasWhatsappSupport,
            whatsappNumber: whatsappNumber || '' // Provide an empty string as fallback
          }
        });
      }, 1000);
    } catch (error) {
      console.error('[RetryPaymentPage] Error processing payment:', error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isValidating) {
    return <RetryPaymentLoading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <Card className="max-w-md w-full shadow-xl border border-purple-100 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 w-full" />
        <CardHeader className="text-center">
          <RetryPaymentHeader />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <RetryCardSubmission
            order={order}
            validationResult={validationResult}
            onSubmit={handleCardSubmit}
            isLoading={isSubmitting}
            hasWhatsappSupport={hasWhatsappSupport}
            whatsappNumber={whatsappNumber}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RetryPaymentPage;
