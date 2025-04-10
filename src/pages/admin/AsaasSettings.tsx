
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AsaasSettingsFormValues } from './AsaasSettingsSchema';
import AsaasSettingsForm from './AsaasSettingsForm';
import { getAsaasConfig, updateAsaasConfig } from '@/services/asaasConfigService';

const AsaasSettings = () => {
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AsaasSettingsFormValues>({
    sandbox: true,
    sandbox_key: '',
    production_key: '',
    pix_enabled: false,
    card_enabled: false,
    active: false,
    use_netlify_functions: false, // Ensure this is included
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await getAsaasConfig();
        if (config) {
          setFormData({
            sandbox: config.sandbox,
            sandbox_key: config.sandbox_key || '',
            production_key: config.production_key || '',
            pix_enabled: config.pix_enabled || false,
            card_enabled: config.card_enabled || false,
            active: config.active || false,
            use_netlify_functions: config.use_netlify_functions || false, // Ensure this is included
          });
        }
      } catch (error) {
        console.error('Error loading Asaas config:', error);
        toast({
          title: 'Erro ao carregar configurações',
          description: 'Não foi possível carregar as configurações do Asaas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  const handleSubmit = async (data: AsaasSettingsFormValues) => {
    setIsSaving(true);
    try {
      await updateAsaasConfig({
        sandbox: data.sandbox,
        sandbox_key: data.sandbox_key,
        production_key: data.production_key || null,
        pix_enabled: data.pix_enabled,
        card_enabled: data.card_enabled,
        active: data.active,
        use_netlify_functions: data.use_netlify_functions, // Ensure this is included
      });
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do Asaas foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error saving Asaas config:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Ocorreu um erro ao salvar as configurações do Asaas.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Asaas</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Asaas</h1>
        <p className="text-muted-foreground">
          Configure a integração com a API de pagamentos do Asaas.
        </p>
      </div>

      <AsaasSettingsForm 
        defaultValues={formData} 
        onSubmit={handleSubmit} 
        isLoading={isSaving} 
      />
    </div>
  );
};

export default AsaasSettings;
