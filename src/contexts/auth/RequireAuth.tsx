
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Somente redirecionar quando o status de autenticação for finalizado
    if (!isLoading) {
      // Se não estiver autenticado, redireciona para login
      if (!user) {
        navigate('/admin/login', { 
          state: { from: location },
          replace: true 
        });
      } 
      // Se acesso admin for necessário mas usuário não for admin
      else if (requireAdmin && !isAdmin) {
        navigate('/admin/tools', { 
          replace: true 
        });
      }
    }
  }, [user, isLoading, isAdmin, navigate, location, requireAdmin]);

  // Enquanto verifica status de autenticação, mostra spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  // Se usuário não estiver autenticado ou não tiver status admin necessário, não renderiza filhos
  // (O useEffect irá tratar o redirecionamento)
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Se todas as verificações passarem, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default RequireAuth;
