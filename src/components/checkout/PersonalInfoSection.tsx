
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomerData } from '@/types/checkout';
import { formatCpfCnpj, formatPhone, validateCpfCnpj } from '@/utils/formatters';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const personalInfoFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  cpfCnpj: z.string()
    .min(11, { message: 'CPF/CNPJ deve ter no mínimo 11 dígitos' })
    .refine((value) => validateCpfCnpj(value), { message: 'CPF/CNPJ inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoFormSchema>;

interface PersonalInfoSectionProps {
  onSubmit: (data: CustomerData) => void;
  headingColor: string;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ onSubmit, headingColor }) => {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoFormSchema),
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

  const handleSubmit = (values: PersonalInfoFormValues) => {
    const customerData: CustomerData = {
      name: values.name,
      email: values.email,
      cpfCnpj: values.cpfCnpj.replace(/\D/g, ''),
      phone: values.phone.replace(/\D/g, ''),
    };

    onSubmit(customerData);
  };

  return (
    <section id="customer-section" className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
      <h2 className="text-xl font-medium mb-6 text-white">
        Identificação
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <FormLabel>Celular com DDD</FormLabel>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-input rounded-l-md text-sm text-gray-500">
                    +55
                  </div>
                  <FormControl>
                    <Input 
                      className="rounded-l-none"
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Continuar para pagamento
          </Button>
        </form>
      </Form>
    </section>
  );
};
