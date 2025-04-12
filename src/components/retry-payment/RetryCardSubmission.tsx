import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CardFormFields, cardSchema } from '@/components/checkout/payment-methods/card';
import { CreditCardData } from '@/types/checkout';
import { detectCardBrand } from '@/components/checkout/payment-methods/card';
import { useToast } from '@/hooks/use-toast';

interface RetryCardSubmissionProps {
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  cardData?: CreditCardData;
}

export const RetryCardSubmission: React.FC<RetryCardSubmissionProps> = ({ onSubmit, isLoading, cardData }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: cardData?.holderName || '',
      number: cardData?.number || '',
      expiryDate: cardData?.expiryDate || '',
      cvv: cardData?.cvv || '',
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <CardFormFields form={form} />

        <Button type="submit" disabled={isLoading} className="w-full mt-6">
          {isLoading ? 'Processando...' : 'Tentar Novamente'}
        </Button>
      </form>
    </Form>
  );
};
