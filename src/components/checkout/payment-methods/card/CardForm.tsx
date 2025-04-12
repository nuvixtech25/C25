
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
import { isExpiryDateValid } from '@/utils/cardValidationUtils';

// Card validation schema
export const cardSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.string().min(13, 'Número inválido').max(19, 'Número inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  expiryDate: z.string()
    .refine(
      val => isExpiryDateValid(val),
      'Data de validade inválida ou cartão vencido'
    ),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido')
});

interface CardFormProps {
  onSubmit: (data: CreditCardData) => void;
  isLoading: boolean;
  buttonColor?: string;
  buttonText?: string;
}

export const CardForm: React.FC<CardFormProps> = ({ 
  onSubmit, 
  isLoading, 
  buttonColor = '#6E59A5',
  buttonText = 'Finalizar Pagamento'
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryDate: '',
      cvv: ''
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
      brand
    };
    
    onSubmit(cardData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <CardFormFields form={form} />
        
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
