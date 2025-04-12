
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomerData } from '@/types/checkout';
import { formatCpfCnpj, formatPhone, validateCpfCnpj } from '@/utils/formatters';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionTitle } from './SectionTitle';
import { User } from 'lucide-react';

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
    <section id="customer-section" className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <div className="flex items-center mb-4 gap-2">
          <User className="text-gray-500" size={20} />
          <h2 className="text-lg font-semibold">Identificação</h2>
        </div>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Nome completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Seu e-mail" 
                        {...field} 
                        className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpfCnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu CPF"
                        {...field}
                        onChange={handleCpfCnpjChange}
                        className="border border-[#E0E0E0] rounded p-2 text-sm text-black bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Celular</FormLabel>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 border-[#E0E0E0] rounded-l-md text-sm text-black bg-white">
                        +55
                      </div>
                      <FormControl>
                        <Input 
                          className="rounded-l-none border border-[#E0E0E0] p-2 text-sm text-black bg-white"
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={handlePhoneChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};
