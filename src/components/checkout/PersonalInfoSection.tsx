
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
    <section id="customer-section" className="bg-[#242424] border border-gray-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">
        Seus dados
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Nome completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome completo" 
                    {...field} 
                    className="bg-[#333333] border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">E-mail</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    {...field} 
                    className="bg-[#333333] border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123.456.789-01"
                    {...field}
                    onChange={handleCpfCnpjChange}
                    className="bg-[#333333] border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Celular com DDD</FormLabel>
                <div className="flex">
                  <div className="flex items-center px-3 bg-[#333333] border border-r-0 border-gray-600 rounded-l-md text-sm text-gray-300">
                    +55
                  </div>
                  <FormControl>
                    <Input 
                      className="rounded-l-none bg-[#333333] border-gray-600 text-white"
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={handlePhoneChange}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 mt-4"
          >
            Continuar para pagamento
          </Button>
        </form>
      </Form>
    </section>
  );
};
