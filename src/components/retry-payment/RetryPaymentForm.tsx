
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreditCardData, Order } from '@/types/checkout';
import { MoveRight } from 'lucide-react';

const formSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.string().min(16, 'Número do cartão inválido').max(19, 'Número do cartão inválido'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Data deve estar no formato MM/AA'),
  cvv: z.string().min(3, 'CVV deve ter pelo menos 3 dígitos'),
});

interface RetryPaymentFormProps {
  order: Order | null;
  validationResult: {
    canProceed: boolean;
    message?: string;
    remainingAttempts?: number;
  } | null;
  onSubmit: (data: CreditCardData) => Promise<void>;
  isLoading: boolean;
  cardData?: CreditCardData;
}

const RetryPaymentForm: React.FC<RetryPaymentFormProps> = ({ 
  order, 
  validationResult, 
  onSubmit,
  isLoading,
  cardData
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      holderName: cardData?.holderName || '',
      number: cardData?.number || '',
      expiryDate: cardData?.expiryDate || '',
      cvv: cardData?.cvv || '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const cardData: CreditCardData = {
      holderName: values.holderName,
      number: values.number.replace(/\s/g, ''),
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      brand: 'unknown', // A marca será detectada pelo servidor
    };
    
    await onSubmit(cardData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no cartão</FormLabel>
              <FormControl>
                <Input placeholder="Nome impresso no cartão" {...field} className="border border-gray-200" />
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
                  className="border border-gray-200" 
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
                    className="border border-gray-200" 
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
                    className="border border-gray-200" 
                    maxLength={4}
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
          className="w-full bg-green-500 hover:bg-green-600 mt-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : (
            <>
              <span>Finalizar pagamento</span>
              <MoveRight className="h-4 w-4" />
            </>
          )}
        </Button>
        
        {validationResult?.message && (
          <p className="text-sm text-center text-gray-500 mt-2">
            {validationResult.message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default RetryPaymentForm;
