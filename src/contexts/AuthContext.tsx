import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  makeUserAdmin: (userId: string) => Promise<void>;
  createAdminUser: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Defer loading profile to prevent Supabase auth deadlock
          setTimeout(() => {
            checkIfUserIsAdmin(newSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        checkIfUserIsAdmin(initialSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIfUserIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.is_admin ?? false);
    } catch (error) {
      console.error('Error in admin check:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Login realizado com sucesso',
        description: 'Você está conectado ao painel administrativo.',
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error.error_description || error.message || 'Ocorreu um erro ao tentar fazer login.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Conta criada com sucesso',
        description: 'Verifique seu e-mail para confirmar sua conta.',
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar a conta.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: error.message || 'Ocorreu um erro ao tentar desconectar.',
        variant: 'destructive',
      });
    }
  };

  const makeUserAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Usuário promovido',
        description: 'O usuário agora tem privilégios de administrador.',
      });
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: 'Erro ao promover usuário',
        description: error.message || 'Ocorreu um erro ao tentar promover o usuário.',
        variant: 'destructive',
      });
    }
  };

  const createAdminUser = async (email: string, password: string) => {
    try {
      // First sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!authData.user) throw new Error('User creation failed');

      // Directly update the profile to be an admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Usuário administrador criado',
        description: `${email} foi criado e promovido a administrador.`,
      });
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Erro ao criar usuário administrador',
        description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar o usuário administrador.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAdmin,
        signIn,
        signOut,
        signUp,
        makeUserAdmin,
        createAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
