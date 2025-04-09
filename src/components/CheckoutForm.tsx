
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BillingData, CustomerData } from '@/types/checkout';
import { formatCpfCnpj, formatPhone, validateCpfCnpj } from '@/utils/formatters';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  cpfCnpj: z.string()
    .min(11, { message: 'CPF/CNPJ deve ter no mínimo 11 dígitos' })
    .refine((value) => validateCpfCnpj(value), { message: 'CPF/CNPJ inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  productValue: number;
  productDescription: string;
  onSubmit: (data: BillingData) => void;
  isLoading: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  productValue, 
  productDescription, 
  onSubmit, 
  isLoading 
}) => {
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
    },
  });

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value);
    form.setValue('cpfCnpj', formatted, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setValue('phone', formatted, { shouldValidate: true });
  };

  const handleSubmitForm = (values: CheckoutFormValues) => {
    const customerData: CustomerData = {
      name: values.name,
      email: values.email,
      cpfCnpj: values.cpfCnpj.replace(/\D/g, ''),
      phone: values.phone.replace(/\D/g, ''),
    };

    const billingData: BillingData = {
      customer: customerData,
      value: productValue,
      description: productDescription,
    };

    onSubmit(billingData);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-asaas-primary">
      <CardHeader>
        <CardTitle className="text-2xl heading-gradient">Checkout</CardTitle>
        <CardDescription>
          Preencha seus dados para finalizar a compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123.456.789-01"
                      {...field}
                      onChange={handleCpfCnpjChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-asaas-primary hover:bg-asaas-secondary"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finalizar compra
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50 rounded-b-lg">
        <p className="text-sm text-muted-foreground">Pagamento via PIX</p>
        <p className="font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(productValue)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default CheckoutForm;
