
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { asaasSettingsSchema, AsaasSettingsFormValues } from './AsaasSettingsSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import OperationModeSettings from './components/OperationModeSettings';
import ApiKeyManager from './components/ApiKeyManager';
import PaymentMethodsToggles from './components/PaymentMethodsToggles';
import NetlifyToggle from './components/NetlifyToggle';
import RedirectPageSelector from './components/RedirectPageSelector';
import AsaasKeyStats from './components/AsaasKeyStats';

interface AsaasSettingsFormProps {
  defaultValues: AsaasSettingsFormValues;
  onSubmit: (data: AsaasSettingsFormValues) => Promise<void>;
  isLoading: boolean;
}

const AsaasSettingsForm: React.FC<AsaasSettingsFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<AsaasSettingsFormValues>({
    resolver: zodResolver(asaasSettingsSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <OperationModeSettings form={form} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <ApiKeyManager />
          <AsaasKeyStats />
        </div>
        
        <PaymentMethodsToggles form={form} />
        <NetlifyToggle form={form} />
        <RedirectPageSelector form={form} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configurações"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AsaasSettingsForm;
