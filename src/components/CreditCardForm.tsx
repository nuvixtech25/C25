
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreditCardData } from '@/types/checkout';

const creditCardFormSchema = z.object({
  holderName: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  number: z.string()
    .min(16, { message: 'Número do cartão inválido' })
    .max(19, { message: 'Número do cartão inválido' })
    .regex(/^[0-9\s-]+$/, { message: 'Apenas números são permitidos' }),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Formato inválido. Use MM/AA' }),
  cvv: z.string()
    .min(3, { message: 'CVV deve ter 3 ou 4 dígitos' })
    .max(4, { message: 'CVV deve ter 3 ou 4 dígitos' })
    .regex(/^\d+$/, { message: 'Apenas números são permitidos' }),
});

type CreditCardFormValues = z.infer<typeof creditCardFormSchema>;

interface CreditCardFormProps {
  onSubmit: (data: CreditCardData) => void;
  isLoading: boolean;
  buttonColor: string;
  buttonText: string;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  isLoading,
  buttonColor,
  buttonText
}) => {
  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardFormSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue('number', formatted, { shouldValidate: true });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    form.setValue('expiryDate', value, { shouldValidate: true });
  };

  const handleSubmit = (values: CreditCardFormValues) => {
    const creditCardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number.replace(/\s/g, ''),
      expiryDate: values.expiryDate,
      cvv: values.cvv,
    };

    onSubmit(creditCardData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do titular</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome como aparece no cartão" 
                  {...field} 
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
              <FormLabel>Número do cartão</FormLabel>
              <FormControl>
                <Input
                  placeholder="0000 0000 0000 0000"
                  {...field}
                  onChange={handleCardNumberChange}
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
                    onChange={handleExpiryDateChange}
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
                    placeholder="123"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      form.setValue('cvv', value, { shouldValidate: true });
                    }}
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
          style={{ backgroundColor: buttonColor }}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </button>
      </form>
    </Form>
  );
};
