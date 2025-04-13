
import React, { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SectionTitle } from './SectionTitle';
import { CustomerData } from '@/types/checkout';
import { PersonalInfoFields } from './PersonalInfoFields';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome completo é obrigatório (mínimo 3 caracteres)' }),
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

  const lastSubmittedRef = useRef<CustomerData | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const lastSubmissionTime = useRef<number>(0);

  const isDataDifferent = (data: CustomerData): boolean => {
    if (!lastSubmittedRef.current) return true;
    
    const last = lastSubmittedRef.current;
    return (
      last.name !== data.name ||
      last.email !== data.email ||
      last.cpfCnpj !== data.cpfCnpj ||
      last.phone !== data.phone
    );
  };

  const canSubmit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    return timeSinceLastSubmission > 3000;
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && form.formState.isValid) {
        const data = form.getValues();
        
        if (isDataDifferent(data) && canSubmit()) {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          debounceTimerRef.current = setTimeout(() => {
            lastSubmissionTime.current = Date.now();
            lastSubmittedRef.current = { ...data };
            onSubmit(data);
            debounceTimerRef.current = null;
          }, 1000);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, onSubmit]);

  return (
    <div id="personal-info-section" className="mb-6 bg-white rounded-lg p-4 md:p-6 border shadow-sm">
      <SectionTitle number={1} title="Identificação" />
      
      <Form {...form}>
        <form 
          ref={formRef} 
          onSubmit={(e) => e.preventDefault()} 
          className="space-y-4 mt-4"
        >
          <PersonalInfoFields control={form.control} />
        </form>
      </Form>
    </div>
  );
};
