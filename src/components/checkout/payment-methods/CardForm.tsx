
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';

// Card validation schema
const cardSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.string().min(13, 'Número inválido').max(19, 'Número inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA inválido'),
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
    // Detectar a bandeira do cartão (simplificado)
    let brand = 'unknown';
    const firstDigit = values.number.charAt(0);
    
    if (firstDigit === '4') {
      brand = 'visa';
    } else if (firstDigit === '5') {
      brand = 'mastercard';
    } else if (firstDigit === '3') {
      brand = 'amex';
    } else if (firstDigit === '6') {
      brand = 'discover';
    }
    
    onSubmit({
      ...values,
      brand
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no Cartão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome como está no cartão" 
                  {...field} 
                  autoComplete="cc-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  {...field}
                  autoComplete="cc-number"
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/AA" 
                    {...field}
                    autoComplete="cc-exp"
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000" 
                    {...field}
                    autoComplete="cc-csc"
                    maxLength={4}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
