
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AddressData } from '@/types/checkout';

interface CepSearchProps {
  form: UseFormReturn<AddressData>;
  isSearching: boolean;
  onSearch: (cep: string) => Promise<void>;
}

export const CepSearch: React.FC<CepSearchProps> = ({ form, isSearching, onSearch }) => {
  return (
    <FormField
      control={form.control}
      name="cep"
      render={({ field }) => (
        <FormItem className="col-span-2 sm:col-span-1">
          <FormLabel>CEP</FormLabel>
          <FormControl>
            <Input 
              placeholder="00000-000" 
              {...field} 
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value.length >= 8) {
                  onSearch(e.target.value);
                }
              }}
              disabled={isSearching}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
