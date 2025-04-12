
import React, { useState } from 'react';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Paintbrush, LayoutTemplate, Clock, Text, Store, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ColorPicker } from './components/ColorPicker';

// Extrair componentes para tornar o código mais limpo e gerenciável
const AppearanceTab = ({ settings, handleChange, handleColorChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Cores e Estilo</CardTitle>
      <CardDescription>
        Personalize as cores e aparência do seu checkout.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="buttonColor">Cor do Botão</Label>
          <div className="flex gap-2">
            <ColorPicker 
              color={settings.buttonColor} 
              onChange={(color) => handleColorChange('buttonColor', color)} 
            />
            <Input 
              id="buttonColor"
              name="buttonColor"
              value={settings.buttonColor}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headingColor">Cor dos Títulos</Label>
          <div className="flex gap-2">
            <ColorPicker 
              color={settings.headingColor} 
              onChange={(color) => handleColorChange('headingColor', color)} 
            />
            <Input 
              id="headingColor"
              name="headingColor"
              value={settings.headingColor}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bannerImageUrl">URL da Imagem de Banner</Label>
        <Input 
          id="bannerImageUrl"
          name="bannerImageUrl"
          value={settings.bannerImageUrl || ''}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
    </CardContent>
  </Card>
);

const ContentTab = ({ settings, handleChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Textos e Mensagens</CardTitle>
      <CardDescription>
        Personalize os textos mostrados na página de checkout.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão de Pagamento</Label>
        <Input 
          id="buttonText"
          name="buttonText"
          value={settings.buttonText}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="topMessage">Mensagem de Topo</Label>
        <Input 
          id="topMessage"
          name="topMessage"
          value={settings.topMessage}
          onChange={handleChange}
        />
      </div>
    </CardContent>
  </Card>
);

const TimerTab = ({ settings, handleChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Temporizador de Oferta</CardTitle>
      <CardDescription>
        Configure um temporizador de contagem regressiva para criar urgência.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="countdownEndTime">Data e Hora de Término</Label>
        <Input 
          id="countdownEndTime"
          name="countdownEndTime"
          type="datetime-local"
          value={settings.countdownEndTime}
          onChange={handleChange}
        />
      </div>
    </CardContent>
  </Card>
);

const ProductTab = ({ settings, handleSwitchChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Configurações do Produto</CardTitle>
      <CardDescription>
        Configure as propriedades relacionadas ao produto.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="isDigitalProduct"
          checked={settings.isDigitalProduct}
          onCheckedChange={(checked) => handleSwitchChange('isDigitalProduct', checked)}
        />
        <Label htmlFor="isDigitalProduct">Produto Digital</Label>
      </div>
    </CardContent>
  </Card>
);

// Função para criar a URL de prévia do checkout
const createPreviewUrl = (settings) => {
  let url = `/checkout/preview?buttonColor=${encodeURIComponent(settings.buttonColor)}&buttonText=${encodeURIComponent(settings.buttonText)}&headingColor=${encodeURIComponent(settings.headingColor)}&topMessage=${encodeURIComponent(settings.topMessage)}&countdownEndTime=${encodeURIComponent(settings.countdownEndTime)}&isDigitalProduct=${settings.isDigitalProduct}`;
  
  if (settings.bannerImageUrl) {
    url += `&bannerImageUrl=${encodeURIComponent(settings.bannerImageUrl)}`;
  }
  
  return url;
};

const AdminTools = () => {
  const customization = useCheckoutCustomization();
  const [settings, setSettings] = useState({
    buttonColor: customization.buttonColor || '#6E59A5',
    buttonText: customization.buttonText || 'Finalizar Compra',
    headingColor: customization.headingColor || '#6E59A5',
    bannerImageUrl: customization.bannerImageUrl || '',
    topMessage: customization.topMessage || 'Oferta por tempo limitado!',
    countdownEndTime: new Date(customization.countdownEndTime || 
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()).toISOString().substring(0, 16),
    isDigitalProduct: customization.isDigitalProduct === undefined ? true : customization.isDigitalProduct
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

  const handleSave = () => {
    // This would be implemented to save to the database
    toast({
      title: "Configurações salvas",
      description: "As configurações do checkout foram atualizadas com sucesso.",
    });
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
