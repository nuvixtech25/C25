
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';
import { detectCardBrand } from './CardBrandDetector';
import { CardFormFields } from './CardFormFields';
import { cardSchema } from './cardValidation';

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
  buttonColor = '#6E59A5',
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
      installments: 1
    }
  });

  const handleSubmit = (values: z.infer<typeof cardSchema>) => {
    // Detect card brand
    const { brand } = detectCardBrand(values.number);
    
    // Create a properly typed card data object
    const cardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number,
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      brand,
      installments: values.installments
    };
    
    onSubmit(cardData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <CardFormFields form={form} productPrice={productPrice} />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-6"
          style={{ backgroundColor: buttonColor }}
        >
          {isLoading ? 'Processando...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};
