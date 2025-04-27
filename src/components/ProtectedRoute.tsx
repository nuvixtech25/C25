import React, { useEffect } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute rendered with:", {
      user: !!user,
      isLoading,
      isAdmin,
      requireAdmin,
      path: location.pathname,
    });

    if (!isLoading && !user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página",
        variant: "destructive",
      });
    } else if (!isLoading && requireAdmin && !isAdmin) {
      toast({
        title: "Acesso restrito",
        description: "Seu usuário não possui permissões de administrador",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, isLoading, requireAdmin, location.pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-gray-600">Verificando autenticação...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    console.log("User is not admin but admin access is required");

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
          <h2 className="text-yellow-800 font-medium text-lg">
            Acesso restrito
          </h2>
          <p className="text-yellow-700 mt-2 mb-4">
            Seu usuário não possui permissões de administrador para acessar esta
            área.
          </p>
          <Button asChild variant="outline">
            <Link to="/admin/dashboard">Ir para Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If all checks pass, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
