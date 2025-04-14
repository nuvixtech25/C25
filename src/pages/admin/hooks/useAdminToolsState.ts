
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckoutCustomizationSettings } from '@/types/customization';
import { supabase } from '@/integrations/supabase/client';

export const useAdminToolsState = (initialCustomization: CheckoutCustomizationSettings) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CheckoutCustomizationSettings>({
    buttonColor: initialCustomization.buttonColor || '#6E59A5',
    buttonText: initialCustomization.buttonText || 'Finalizar Compra',
    headingColor: initialCustomization.headingColor || '#6E59A5',
    bannerImageUrl: initialCustomization.bannerImageUrl || '',
    topMessage: initialCustomization.topMessage || 'Oferta por tempo limitado!',
    countdownEndTime: new Date(initialCustomization.countdownEndTime || 
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()).toISOString().substring(0, 16),
    isDigitalProduct: initialCustomization.isDigitalProduct === undefined ? true : initialCustomization.isDigitalProduct,
    bannerColor: initialCustomization.bannerColor || '#000000',
    showRandomVisitors: initialCustomization.showRandomVisitors !== false, // Default to true if not specified
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked });
  };

  const handleColorChange = (name: string, color: string) => {
    setSettings({ ...settings, [name]: color });
  };

  const handleSave = async () => {
    try {
      const dbSettings = {
        button_color: settings.buttonColor,
        button_text: settings.buttonText,
        heading_color: settings.headingColor,
        banner_image_url: settings.bannerImageUrl || null,
        header_message: settings.topMessage,
        show_banner: true,
        banner_color: settings.bannerColor,
        show_random_visitors: settings.showRandomVisitors
      };
      
      console.log('Saving checkout customization:', dbSettings);
      
      const { data: existingData, error: existingError } = await supabase
        .from('checkout_customization')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (existingError) {
        console.error('Error checking existing customization:', existingError);
        throw existingError;
      }
      
      let result;
      
      if (existingData?.id) {
        result = await supabase
          .from('checkout_customization')
          .update(dbSettings)
          .eq('id', existingData.id);
      } else {
        result = await supabase
          .from('checkout_customization')
          .insert(dbSettings);
      }
      
      if (result.error) {
        console.error('Error saving customization:', result.error);
        throw result.error;
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do checkout foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave
  };
};
