
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionTitle } from './SectionTitle';
import { CustomerData } from '@/types/checkout';
import { handleCpfCnpjChange, handlePhoneChange } from '@/utils/formatters';

const customerSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpfCnpj: z.string().min(11, { message: 'CPF/CNPJ deve ter no mínimo 11 dígitos' }),
  phone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
});

interface PersonalInfoSectionProps {
  onSubmit: (data: CustomerData) => void;
  headingColor?: string;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  onSubmit, 
  headingColor = '#000000',
  formRef
}) => {
  const form = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
    },
    mode: 'onChange'
  });

  // Automatically submit valid form data when values change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Only attempt to submit when fields change and the form is valid
      if (type === 'change' && form.formState.isValid) {
        const data = form.getValues();
        onSubmit(data);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  return (
    <div className="mb-6 bg-white rounded-lg p-4 md:p-6 border shadow-sm">
      <SectionTitle number={1} title="Identificação" />
      
      <Form {...form}>
        <form 
          ref={formRef} 
          onSubmit={(e) => e.preventDefault()} 
          className="space-y-4 mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nome completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      {...field} 
                      className="border-gray-300 focus:border-primary" 
                    />
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
                  <FormLabel className="text-gray-700">E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu e-mail" 
                      type="email" 
                      {...field} 
                      className="border-gray-300 focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu CPF" 
                      value={value}
                      {...rest} 
                      onChange={(e) => handleCpfCnpjChange(e, onChange)}
                      maxLength={18} 
                      className="border-gray-300 focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Celular</FormLabel>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                      +55
                    </span>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        value={value}
                        {...rest} 
                        onChange={(e) => handlePhoneChange(e, onChange)}
                        maxLength={15} 
                        className="border-gray-300 focus:border-primary rounded-l-none" 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
