
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Login = () => {
  const { signIn, session, createAdminUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // If user is already logged in, redirect to admin
  useEffect(() => {
    if (session) {
      navigate('/admin/products');
    }
  }, [session, navigate]);

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      // No need to navigate here as the useEffect will handle this
      // when the session is updated
    } catch (error) {
      // Error is handled in the signIn function
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: { email: string; password: string; confirmPassword: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      
      setActiveTab("login");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar a conta.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAdminUser = async () => {
    setIsCreatingAdmin(true);
    try {
      await createAdminUser("elianemourasara@gmail.com", "pass123");
      toast({
        title: "Administrador criado",
        description: "O usuário elianemourasara@gmail.com foi criado como administrador.",
      });
    } catch (error) {
      // Error is handled in the createAdminUser function
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Painel Administrativo</CardTitle>
          <CardDescription className="text-center">
            Acesse o painel administrativo com seu e-mail e senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onSubmit={handleSignIn}
                isSubmitting={isSubmitting}
              />
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleCreateAdminUser}
                  disabled={isCreatingAdmin}
                >
                  {isCreatingAdmin ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Admin (elianemourasara@gmail.com)
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                onSubmit={handleRegister}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
