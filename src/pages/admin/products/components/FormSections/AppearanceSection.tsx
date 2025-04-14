
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../ProductSchema';
import { Paintbrush } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '../../../components/ColorPicker';

interface AppearanceSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ form }) => {
  const useGlobalColors = form.watch('use_global_colors');
  
  // Garantir que os campos de cor sejam limpos quando usar cores globais
  useEffect(() => {
    if (useGlobalColors) {
      // Limpar os valores de cor quando usar cores globais for ativado
      form.setValue('button_color', undefined);
      form.setValue('heading_color', undefined);
      form.setValue('banner_color', undefined);
    } else {
      // Definir valores padrão quando usar cores globais for desativado
      if (!form.getValues('button_color')) {
        form.setValue('button_color', '#28A745');
      }
      if (!form.getValues('heading_color')) {
        form.setValue('heading_color', '#000000');
      }
      if (!form.getValues('banner_color')) {
        form.setValue('banner_color', '#000000');
      }
    }
  }, [useGlobalColors, form]);

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="appearance">
      <AccordionItem value="appearance">
        <AccordionTrigger className="font-semibold">
          <div className="flex items-center">
            <Paintbrush className="h-4 w-4 mr-2" />
            Aparência Personalizada
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="use_global_colors"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Usar cores globais
                    </FormLabel>
                    <FormDescription>
                      Ative para usar as cores padrão definidas nas configurações de checkout
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        // Forçar o estado no formulário
                        form.setValue('use_global_colors', value, { shouldDirty: true });
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!useGlobalColors && (
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="button_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Botão</FormLabel>
                      <div className="flex gap-2">
                        <ColorPicker 
                          color={field.value || '#28A745'} 
                          onChange={(color) => {
                            field.onChange(color);
                            form.setValue('button_color', color, { shouldDirty: true });
                          }} 
                        />
                        <Input
                          {...field}
                          value={field.value || '#28A745'}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            form.setValue('button_color', e.target.value, { shouldDirty: true });
                          }}
                        />
                      </div>
                      <FormDescription>
                        Cor do botão de finalizar compra
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heading_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor dos Títulos</FormLabel>
                      <div className="flex gap-2">
                        <ColorPicker 
                          color={field.value || '#000000'} 
                          onChange={(color) => {
                            field.onChange(color);
                            form.setValue('heading_color', color, { shouldDirty: true });
                          }} 
                        />
                        <Input
                          {...field}
                          value={field.value || '#000000'}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            form.setValue('heading_color', e.target.value, { shouldDirty: true });
                          }}
                        />
                      </div>
                      <FormDescription>
                        Cor dos títulos e textos principais
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banner_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Banner</FormLabel>
                      <div className="flex gap-2">
                        <ColorPicker 
                          color={field.value || '#000000'} 
                          onChange={(color) => {
                            field.onChange(color);
                            form.setValue('banner_color', color, { shouldDirty: true });
                          }} 
                        />
                        <Input
                          {...field}
                          value={field.value || '#000000'}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            form.setValue('banner_color', e.target.value, { shouldDirty: true });
                          }}
                        />
                      </div>
                      <FormDescription>
                        Cor de fundo do banner de contagem regressiva
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AppearanceSection;
