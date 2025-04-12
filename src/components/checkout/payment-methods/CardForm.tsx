
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditCardData } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check } from 'lucide-react';

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

// Função para detectar e retornar a bandeira do cartão baseado no número
const detectCardBrand = (cardNumber: string): { brand: string; icon: React.ReactNode } => {
  // Remover espaços e caracteres não numéricos
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Visa: começa com 4
  if (/^4/.test(cleanNumber)) {
    return { 
      brand: 'visa', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 5H2.5C1.4 5 0.5 5.9 0.5 7V17C0.5 18.1 1.4 19 2.5 19H21.5C22.6 19 23.5 18.1 23.5 17V7C23.5 5.9 22.6 5 21.5 5Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15L10 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15L13 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 15L19 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    };
  }
  
  // Mastercard: começa com 51-55 ou entre 2221 e 2720
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) {
    return { 
      brand: 'mastercard', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="12" r="5" fill="#EB001B" />
        <circle cx="16" cy="12" r="5" fill="#F79E1B" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 15.98C13.3889 14.8432 14.25 13.0294 14.25 11C14.25 8.97059 13.3889 7.15681 12 6.02C10.6111 7.15681 9.75 8.97059 9.75 11C9.75 13.0294 10.6111 14.8432 12 15.98Z" fill="#FF5F00" />
      </svg>
    };
  }
  
  // American Express: começa com 34 ou 37
  if (/^3[47]/.test(cleanNumber)) {
    return { 
      brand: 'amex', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#1F72CD" />
        <path d="M12 12.5L14 9H17L13 15H10L6 9H9L11 12.5H12Z" fill="white" />
        <path d="M19 11H16V10H19V9H16V8H19V7H15V12H19V11Z" fill="white" />
      </svg>
    };
  }
  
  // Discover: começa com 6011, 644-649 ou 65
  if (/^(6011|64[4-9]|65)/.test(cleanNumber)) {
    return { 
      brand: 'discover', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#FF6600" />
        <path d="M13 15C16.866 15 20 12.3137 20 9C20 5.68629 16.866 3 13 3C9.13401 3 6 5.68629 6 9C6 12.3137 9.13401 15 13 15Z" fill="#EEEEEE" />
        <path d="M10 10.5C10 9.11929 11.1193 8 12.5 8H15C16.1046 8 17 8.89543 17 10V12C17 13.1046 16.1046 14 15 14H12.5C11.1193 14 10 12.8807 10 11.5V10.5Z" fill="#FF6600" />
      </svg>
    };
  }
  
  // Diners Club: começa com 300-305, 36, 38-39
  if (/^(30[0-5]|36|38|39)/.test(cleanNumber)) {
    return { 
      brand: 'diners', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#0079BE" />
        <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
      </svg>
    };
  }
  
  // Elo: começa com 636368, 438935, 504175, 451416, 509048, 509067, 509049, 509069, 509050, 509074, 509068, 509040, 509045, 509051, 509046, 509066, 509047, 509042, 509052, 509043, 509064, 509053
  if (/^(636368|438935|504175|451416|5090(4[0-9]|5[0-9]|6[0-9]|7[0-4]))/.test(cleanNumber)) {
    return { 
      brand: 'elo', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#00A4E0" />
        <path d="M11 10L13 12L11 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8L6 12L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8L18 12L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    };
  }
  
  // Hipercard: começa com 606282
  if (/^(606282)/.test(cleanNumber)) {
    return { 
      brand: 'hipercard', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#822124" />
        <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    };
  }
  
  // Se não encontrou nenhuma bandeira
  return { 
    brand: 'unknown', 
    icon: <CreditCard className="h-5 w-5 text-gray-400" /> 
  };
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
  const [cardBrand, setCardBrand] = useState<{ brand: string; icon: React.ReactNode }>({ 
    brand: 'unknown', 
    icon: <CreditCard className="h-5 w-5 text-gray-400" /> 
  });
  
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
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    onChange(cleaned);
    
    // Detectar bandeira do cartão
    setCardBrand(detectCardBrand(cleaned));
  };

  const handleSubmit = (values: z.infer<typeof cardSchema>) => {
    // Detectar a bandeira do cartão (simplificado)
    let brand = cardBrand.brand;
    
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
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    placeholder="0000 0000 0000 0000" 
                    {...rest}
                    onChange={(e) => handleCardNumberChange(e, onChange)}
                    autoComplete="cc-number"
                    maxLength={19}
                  />
                </FormControl>
                {rest.value && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {cardBrand.icon}
                  </div>
                )}
              </div>
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
