
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { formatExpiryDate } from '@/utils/cardValidationUtils';
import { CardBrandDisplay, requiresFourDigitCvv } from './CardBrandDetector';
import { cardSchema } from './cardValidation';
import { handleCardNumberChange, handleExpiryDateChange } from './formatters/cardInputFormatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardFormFieldsProps {
  form: UseFormReturn<z.infer<typeof cardSchema>>;
}

export const CardFormFields: React.FC<CardFormFieldsProps> = ({ form }) => {
  return (
    <>
      <CardHolderField form={form} />
      <CardNumberField form={form} />
      
      <div className="grid grid-cols-2 gap-4">
        <ExpiryDateField form={form} />
        <CvvField form={form} />
      </div>
      
      <InstallmentsField form={form} />
    </>
  );
};

// Individual form field components
const CardHolderField: React.FC<CardFormFieldsProps> = ({ form }) => (
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
);

const CardNumberField: React.FC<CardFormFieldsProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="number"
    render={({ field: { onChange, value, ...rest } }) => (
      <FormItem>
        <FormLabel>Número do Cartão</FormLabel>
        <div className="relative">
          <FormControl>
            <Input 
              placeholder="0000 0000 0000 0000" 
              value={value} 
              {...rest}
              onChange={(e) => handleCardNumberChange(e, onChange)}
              autoComplete="cc-number"
              maxLength={19}  // 16 digits + 3 spaces
            />
          </FormControl>
          {value && <CardBrandDisplay cardNumber={value} />}
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ExpiryDateField: React.FC<CardFormFieldsProps> = ({ form }) => (
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
            onChange={(e) => handleExpiryDateChange(e, onChange, formatExpiryDate)}
            autoComplete="cc-exp"
            maxLength={5}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const CvvField: React.FC<CardFormFieldsProps> = ({ form }) => {
  const cardNumber = form.watch('number') || '';
  const isFourDigitCvv = requiresFourDigitCvv(cardNumber);
  
  return (
    <FormField
      control={form.control}
      name="cvv"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CVV</FormLabel>
          <FormControl>
            <Input 
              placeholder={isFourDigitCvv ? "0000" : "000"} 
              {...field}
              autoComplete="cc-csc"
              maxLength={isFourDigitCvv ? 4 : 3}
              type="text" // Changed from "password" to "text" to show the CVV numbers
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const InstallmentsField: React.FC<CardFormFieldsProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="installments"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Parcelas (sem juros)</FormLabel>
        <Select 
          onValueChange={(value) => field.onChange(parseInt(value))} 
          defaultValue={field.value?.toString() || "1"}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o número de parcelas" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="1">1x de {formatInstallmentValue(form.getValues().number)}</SelectItem>
            <SelectItem value="2">2x sem juros</SelectItem>
            <SelectItem value="3">3x sem juros</SelectItem>
            <SelectItem value="4">4x sem juros</SelectItem>
            <SelectItem value="5">5x sem juros</SelectItem>
            <SelectItem value="6">6x sem juros</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

// Helper function to format installment value (will be improved in future to show actual value)
const formatInstallmentValue = (cardNumber: string | undefined) => {
  return "à vista";
};

