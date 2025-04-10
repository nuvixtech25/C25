
import React from 'react';
import { Facebook } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface FacebookPixelSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
}

export const FacebookPixelSection: React.FC<FacebookPixelSectionProps> = ({ form }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Facebook Pixel</h3>
        </div>
        <FormField
          control={form.control}
          name="facebookEnabled"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Ativo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="facebookPixelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Facebook Pixel</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: 123456789012345" {...field} />
              </FormControl>
              <FormDescription>
                O ID do Facebook Pixel é um número de 15 dígitos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="facebookToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token de Acesso</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: EAAxxxxxxxxxxxxx" {...field} />
              </FormControl>
              <FormDescription>
                O token de acesso do Facebook é usado para autenticação avançada com o Facebook Pixel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
