
import React, { useState, useEffect } from 'react';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Paintbrush, LayoutTemplate, Clock, Text, Store, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPreviewUrl } from '@/utils/previewUtils';
import { CheckoutCustomizationSettings } from '@/types/customization';
import { AppearanceTab } from './components/customization/AppearanceTab';
import { ContentTab } from './components/customization/ContentTab';
import { TimerTab } from './components/customization/TimerTab';
import { ProductTab } from './components/customization/ProductTab';
import { supabase } from '@/integrations/supabase/client';

const AdminTools: React.FC = () => {
  const customization = useCheckoutCustomization();
  const { toast } = useToast();
  const [settings, setSettings] = useState<CheckoutCustomizationSettings>({
    buttonColor: customization.buttonColor || '#6E59A5',
    buttonText: customization.buttonText || 'Finalizar Compra',
    headingColor: customization.headingColor || '#6E59A5',
    bannerImageUrl: customization.bannerImageUrl || '',
    topMessage: customization.topMessage || 'Oferta por tempo limitado!',
    countdownEndTime: new Date(customization.countdownEndTime || 
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()).toISOString().substring(0, 16),
    isDigitalProduct: customization.isDigitalProduct === undefined ? true : customization.isDigitalProduct,
    bannerColor: customization.bannerColor || '#000000'
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
      // Convert settings to database format
      const dbSettings = {
        button_color: settings.buttonColor,
        button_text: settings.buttonText,
        heading_color: settings.headingColor,
        banner_image_url: settings.bannerImageUrl || null,
        header_message: settings.topMessage,
        show_banner: true,
        banner_color: settings.bannerColor
      };
      
      console.log('Saving checkout customization:', dbSettings);
      
      // Check if there's an existing record
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
        // Update existing record
        result = await supabase
          .from('checkout_customization')
          .update(dbSettings)
          .eq('id', existingData.id);
      } else {
        // Insert new record
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

  const handlePreview = () => {
    const previewUrl = createPreviewUrl(settings);
    window.open(previewUrl, 'checkout_preview', 'width=1024,height=768,location=yes,resizable=yes,scrollbars=yes,status=yes');
  };

  const handleSidePreview = () => {
    const previewUrl = createPreviewUrl(settings);
    const width = window.innerWidth / 2;
    const height = window.innerHeight;
    const left = window.innerWidth / 2;
    
    window.open(
      previewUrl, 
      'checkout_preview', 
      `width=${width},height=${height},left=${left},top=0,location=yes,resizable=yes,scrollbars=yes,status=yes`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personalização do Checkout</h2>
          <p className="text-muted-foreground">
            Personalize a aparência e comportamento da sua página de checkout.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="secondary" onClick={handleSidePreview}>
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Visualizar ao lado
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">
            <Paintbrush className="h-4 w-4 mr-2" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="content">
            <Text className="h-4 w-4 mr-2" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="timer">
            <Clock className="h-4 w-4 mr-2" />
            Temporizador
          </TabsTrigger>
          <TabsTrigger value="product">
            <Store className="h-4 w-4 mr-2" />
            Produto
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <AppearanceTab
            settings={settings}
            handleChange={handleChange}
            handleColorChange={handleColorChange}
          />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <ContentTab
            settings={settings}
            handleChange={handleChange}
          />
        </TabsContent>
        
        <TabsContent value="timer" className="space-y-4 mt-4">
          <TimerTab
            settings={settings}
            handleChange={handleChange}
          />
        </TabsContent>
        
        <TabsContent value="product" className="space-y-4 mt-4">
          <ProductTab
            settings={settings}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTools;
