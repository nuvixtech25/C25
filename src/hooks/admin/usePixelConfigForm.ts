
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { fetchPixelConfig, updatePixelConfig, PixelConfig } from '@/services/pixelConfigService';
import { pixelConfigSchema, PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

export const usePixelConfigForm = () => {
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
      facebookToken: '',
      googleEnabled: false,
      facebookEnabled: false,
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
  
  return {
    form,
    loading,
    saving,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
