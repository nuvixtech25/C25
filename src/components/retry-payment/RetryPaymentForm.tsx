
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CardFormFields } from '@/components/checkout/payment-methods/card/CardFormFields';
import { cardSchema } from '@/components/checkout/payment-methods/card/cardValidation';
import { CreditCardData, Order } from '@/types/checkout';
import { detectCardBrand } from '@/components/checkout/payment-methods/card/CardBrandDetector';
import { useToast } from '@/hooks/use-toast';

interface RetryPaymentFormProps {
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  cardData?: CreditCardData;
  order: Order | null;
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
    waitTime?: number;
  } | null;
}

const RetryPaymentForm: React.FC<RetryPaymentFormProps> = ({ 
  onSubmit, 
  isLoading, 
  cardData,
  order,
  validationResult
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: cardData?.holderName || '',
      number: cardData?.number || '',
      expiryDate: cardData?.expiryDate || '',
      cvv: cardData?.cvv || '',
      installments: cardData?.installments || 1,
    },
  });

  const handleSubmit = async (values: z.infer<typeof cardSchema>) => {
    try {
      const { brand } = detectCardBrand(values.number);

      const cardData: CreditCardData = {
        holderName: values.holderName,
        number: values.number,
        expiryDate: values.expiryDate,
        cvv: values.cvv,
        brand,
        installments: values.installments || 1,
      };

      await onSubmit(cardData);
    } catch (error: any) {
      toast({
        title: "Erro ao processar o pagamento",
        description: error.message || "Ocorreu um erro ao tentar processar o pagamento. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!validationResult?.canProceed) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <CardFormFields form={form} productPrice={order?.productPrice} />

        <Button type="submit" disabled={isLoading} className="w-full mt-6">
          {isLoading ? 'Processando...' : 'Tentar Novamente'}
        </Button>
      </form>
    </Form>
  );
};

export default RetryPaymentForm;
