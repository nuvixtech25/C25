
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkIfUserIsAdmin, signIn, signOut, signUp, makeUserAdmin, createAdminUser } from './authActions';
import { AuthContextType } from './authTypes';

export const useAuthProvider = (): AuthContextType => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Melhorado o gerenciamento de autenticação para evitar loops

    // Obter sessão inicial
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          const adminStatus = await checkIfUserIsAdmin(initialSession.user.id);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Configurar listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Defer loading profile to prevent Supabase auth deadlock
          setTimeout(() => {
            checkIfUserIsAdmin(newSession.user.id).then(adminStatus => {
              setIsAdmin(adminStatus);
            });
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Obter sessão inicial
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isLoading,
    isAdmin,
    signIn,
    signOut,
    signUp,
    makeUserAdmin,
    createAdminUser,
  };
};
