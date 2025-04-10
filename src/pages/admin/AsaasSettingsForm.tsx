import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { asaasSettingsSchema, AsaasSettingsFormValues } from './AsaasSettingsSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AsaasSettingsFormProps {
  defaultValues: AsaasSettingsFormValues;
  onSubmit: (data: AsaasSettingsFormValues) => Promise<void>;
  isLoading: boolean;
}

const MANUAL_REDIRECT_OPTIONS = [
  { value: '/payment-success', label: '✅ Pagamento Concluído' },
  { value: '/payment-pending', label: '⏳ Pagamento Pendente' },
  { value: '/payment-failed', label: '❌ Pagamento Falhou' },
  { value: '/payment-analysis', label: '🔍 Pagamento em Análise' },
  { value: '/thank-you-card', label: '🙏 Agradecimento (Cartão)' },
] as const;

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
        <Card>
          <CardHeader>
            <CardTitle>Modo de Operação</CardTitle>
            <CardDescription>
              Configure o ambiente e ative/desative a integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="sandbox"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Modo Sandbox</FormLabel>
                    <FormDescription>
                      Ative para usar o ambiente de testes do Asaas
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
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Integração Ativa</FormLabel>
                    <FormDescription>
                      Ative para habilitar a integração com o Asaas
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>
              Configure as chaves de acesso à API do Asaas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="sandbox_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Sandbox</FormLabel>
                  <FormControl>
                    <Input placeholder="$aas_SANDBOX_..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Chave de API para o ambiente de testes
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="production_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave de Produção</FormLabel>
                  <FormControl>
                    <Input placeholder="$aas_..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Chave de API para o ambiente de produção
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              Configure os métodos de pagamento disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="pix_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">PIX</FormLabel>
                    <FormDescription>
                      Habilitar pagamentos via PIX
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
              name="card_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cartão de Crédito</FormLabel>
                    <FormDescription>
                      Habilitar pagamentos via cartão de crédito
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integração Netlify</CardTitle>
            <CardDescription>
              Configure o uso das funções Netlify para processamento de pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="use_netlify_functions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Usar Funções Netlify</FormLabel>
                    <FormDescription>
                      Ative para usar funções Netlify no processamento de pagamentos PIX
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redirecionamento Manual de Cartão</CardTitle>
            <CardDescription>
              Configure a página de redirecionamento após pagamentos com cartão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="manual_card_redirect_page"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Página de Redirecionamento para Cartão</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a página de redirecionamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MANUAL_REDIRECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha para onde os clientes serão redirecionados após o pagamento com cartão
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
