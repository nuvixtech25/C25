
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreditCardData } from '@/types/checkout';
import { detectCardBrand } from './CardBrandDetector';

const cardSchema = z.object({
  holderName: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  number: z.string().min(16, { message: 'Número de cartão inválido' }).max(19),
  month: z.string().min(2, { message: 'Mês inválido' }).max(2),
  year: z.string().min(2, { message: 'Ano inválido' }).max(2),
  cvv: z.string().min(3, { message: 'CVV inválido' }).max(4),
});

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
  buttonColor = '#28A745',
  buttonText = 'Finalizar Pagamento',
  productPrice = 0
}) => {
  
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      month: '',
      year: '',
      cvv: '',
    }
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
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

  const handleSubmit = (values: z.infer<typeof cardSchema>) => {
    // Create a properly typed card data object
    const cardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number.replace(/\s/g, ''),
      expiryDate: `${values.month}/${values.year}`,
      cvv: values.cvv,
      brand: detectCardBrand(values.number).brand,
    };
    
    onSubmit(cardData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Nome no cartão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome como aparece no cartão" 
                  {...field} 
                  className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Número do cartão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  {...field}
                  onChange={handleCardNumberChange}
                  className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                  maxLength={19}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Mês</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM" 
                    {...field}
                    className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                    maxLength={2}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Ano</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="AA" 
                    {...field}
                    className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                    maxLength={2}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">CVV</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    {...field}
                    className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 mt-6 text-base font-semibold"
          style={{ backgroundColor: buttonColor }}
        >
          {isLoading ? 'Processando...' : buttonText}
        </Button>
      </form>
    </Form>
  );
};
