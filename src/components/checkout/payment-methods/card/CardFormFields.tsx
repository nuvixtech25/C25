
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { formatExpiryDate } from '@/utils/cardValidationUtils';
import { CardBrandDisplay } from './CardBrandDetector';
import { cardSchema } from './CardForm';

interface CardFormFieldsProps {
  form: UseFormReturn<z.infer<typeof cardSchema>>;
}

export const CardFormFields: React.FC<CardFormFieldsProps> = ({ form }) => {
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const { value } = e.target;
    const formatted = formatExpiryDate(value);
    onChange(formatted);
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    // Get the current cursor position, defaulting to end position if null
    const cursorPos = e.target.selectionStart ?? e.target.value.length;
    
    // Get the current value
    let { value } = e.target;
    
    // First remove any existing spaces
    const valueWithoutSpaces = value.replace(/ /g, '');
    
    // Remove any other non-numeric characters
    const cleaned = valueWithoutSpaces.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    // Update form value with the cleaned value (no spaces)
    onChange(cleaned);
    
    // Set the formatted value with spaces back into the input
    e.target.value = formatted;
    
    // Calculate new cursor position after formatting
    const addedSpaces = formatted.length - cleaned.length;
    const newCursorPos = cursorPos + (addedSpaces - (value.length - valueWithoutSpaces.length));
    
    // Set the cursor position to where it should be after formatting
    // Only attempt to set selection range if the element is focused
    if (document.activeElement === e.target) {
      setTimeout(() => {
        e.target.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <>
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
                  maxLength={19}  // 16 digits + 3 spaces
                />
              </FormControl>
              {rest.value && <CardBrandDisplay cardNumber={rest.value} />}
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
    </>
  );
};
