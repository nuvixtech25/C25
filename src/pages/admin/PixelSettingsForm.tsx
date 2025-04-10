
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPixelConfig, updatePixelConfig, PixelConfig } from '@/services/pixelConfigService';
import { pixelConfigSchema, PixelConfigFormValues } from './PixelSettingsSchema';

export const PixelSettingsForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with React Hook Form
  const form = useForm<PixelConfigFormValues>({
    resolver: zodResolver(pixelConfigSchema),
    defaultValues: {
      googleAdsId: '',
      conversionLabel: '',
      facebookPixelId: '',
      enabled: false,
    },
  });
  
  // Load initial data from Supabase
  useEffect(() => {
    const loadPixelConfig = async () => {
      try {
        setLoading(true);
        const config = await fetchPixelConfig();
        form.reset(config);
        console.log('Pixel Config loaded:', config);
      } catch (error) {
        console.error('Erro ao carregar configurações de Pixels:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações de Pixels.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPixelConfig();
  }, [form, toast]);
  
  // Handle form submission
  const onSubmit = async (values: PixelConfigFormValues) => {
    try {
      setSaving(true);
      const updatedConfig = await updatePixelConfig(values as PixelConfig);
      console.log('Pixel Config updated:', updatedConfig);
      toast({
        title: 'Sucesso',
        description: 'Configurações de Pixels atualizadas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações de Pixels:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações de Pixels.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Pixels de Rastreamento</CardTitle>
        <CardDescription>
          Configure os pixels de rastreamento para o Google Ads e Facebook Ads (Meta).
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativar Rastreamento</FormLabel>
                      <FormDescription>
                        Ativa os pixels de rastreamento em seu site.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
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
                    <FormLabel>Label de Conversão do Google Ads</FormLabel>
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
              
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default PixelSettingsForm;
