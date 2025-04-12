
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

// Função para formatar data de expiração MM/AA
const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
};

// Validação para verificar se a data de expiração é válida e não está vencida
const isExpiryDateValid = (value: string): boolean => {
  // Formato esperado: MM/AA
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!pattern.test(value)) return false;
  
  const parts = value.split('/');
  const month = parseInt(parts[0], 10);
  const year = parseInt(`20${parts[1]}`, 10);
  
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Js meses são 0-indexed
  const currentYear = today.getFullYear();
  
  // Verificar se o cartão já expirou
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Card validation schema
const cardSchema = z.object({
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

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const { value } = e.target;
    const formatted = formatExpiryDate(value);
    onChange(formatted);
  };

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
    
    // Ensure all required properties are available and create a properly typed object
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
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/AA" 
                    {...rest}
                    onChange={(e) => handleExpiryDateChange(e, onChange)}
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
