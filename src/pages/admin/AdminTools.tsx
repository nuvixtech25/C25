
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const adminToolsSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type AdminToolsFormValues = z.infer<typeof adminToolsSchema>;

const AdminTools = () => {
  const { isAdmin, makeUserAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminToolsFormValues>({
    resolver: zodResolver(adminToolsSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleMakeAdmin = async (data: AdminToolsFormValues) => {
    setIsLoading(true);
    try {
      // First find the user by email
      const { data: user, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        toast({
          title: 'Usuário não encontrado',
          description: `Não foi possível encontrar um usuário com o e-mail ${data.email}`,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Make user admin
      await makeUserAdmin(user.id);
      form.reset();
      
      toast({
        title: 'Usuário promovido',
        description: `${data.email} agora tem privilégios de administrador.`,
      });
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: 'Erro ao promover usuário',
        description: error.message || 'Ocorreu um erro ao tentar dar privilégios de administrador.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de Administração</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas de Administração</CardTitle>
        <CardDescription>
          Gerencie usuários e permissões do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Promoção de Usuários</h3>
            <p className="text-sm text-gray-500 mb-4">
              Conceda privilégios de administrador a um usuário existente
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleMakeAdmin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do Usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario@exemplo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Digite o e-mail do usuário que deseja promover a administrador
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Fazer Usuário Administrador"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTools;
