
import React from 'react';
import { GoogleCircle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface GoogleAdsSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
}

export const GoogleAdsSection: React.FC<GoogleAdsSectionProps> = ({ form }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GoogleCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium">Google Ads</h3>
        </div>
        <FormField
          control={form.control}
          name="googleEnabled"
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
          name="googleAdsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Google Ads</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: AW-123456789" {...field} />
              </FormControl>
              <FormDescription>
                O ID do Google Ads começa com 'AW-' seguido por números.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="conversionLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label de Conversão</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: AbCdEfGhIjK-123" {...field} />
              </FormControl>
              <FormDescription>
                O label de conversão é usado para rastrear conversões específicas no Google Ads.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
