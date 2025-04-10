
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Settings } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPixConfig, updatePixConfig, PixConfig } from '@/services/pixConfigService';

// Schema for form validation
const pixConfigSchema = z.object({
  id: z.string().optional(),
  chavepix: z.string().min(1, 'Chave PIX é obrigatória'),
  tipochave: z.string().min(1, 'Tipo de chave é obrigatório'),
  beneficiario: z.string().min(1, 'Nome do beneficiário é obrigatório'),
  copiaecola: z.string().min(1, 'Código copia e cola é obrigatório'),
  mensagemopcional: z.string().optional(),
});

type PixConfigFormValues = z.infer<typeof pixConfigSchema>;

const PixSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with React Hook Form
  const form = useForm<PixConfigFormValues>({
    resolver: zodResolver(pixConfigSchema),
    defaultValues: {
      chavepix: '',
      tipochave: '',
      beneficiario: '',
      copiaecola: '',
      mensagemopcional: '',
    },
  });
  
  // Load initial data from Supabase
  useEffect(() => {
    const loadPixConfig = async () => {
      try {
        setLoading(true);
        const config = await fetchPixConfig();
        form.reset(config);
      } catch (error) {
        console.error('Erro ao carregar configurações PIX:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações PIX.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPixConfig();
  }, [form, toast]);
  
  // Handle form submission
  const onSubmit = async (values: PixConfigFormValues) => {
    try {
      setSaving(true);
      await updatePixConfig(values as PixConfig);
      toast({
        title: 'Sucesso',
        description: 'Configurações PIX atualizadas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações PIX:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações PIX.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Configurações de Pagamento PIX
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do PIX</CardTitle>
          <CardDescription>
            Configure as informações para recebimento via PIX em sua loja.
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
                  name="chavepix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave PIX</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira sua chave PIX" {...field} />
                      </FormControl>
                      <FormDescription>
                        CPF, CNPJ, celular, e-mail ou chave aleatória.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipochave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Chave</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF, CNPJ, Email, Telefone, Aleatória" {...field} />
                      </FormControl>
                      <FormDescription>
                        Especifique o tipo de chave PIX cadastrada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="beneficiario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Beneficiário</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo ou razão social" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome que aparecerá para o pagador.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="copiaecola"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Copia e Cola (Estático)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Código PIX Copia e Cola para pagamentos estáticos" 
                          className="min-h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Código para pagamentos estáticos sem valor predefinido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mensagemopcional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem Opcional</FormLabel>
                      <FormControl>
                        <Input placeholder="Mensagem para o pagador (opcional)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Aparecerá para o pagador durante a transação.
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
    </div>
  );
};

export default PixSettings;
