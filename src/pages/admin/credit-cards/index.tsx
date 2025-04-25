
import React, { useState, useEffect } from 'react';
import { useCreditCards } from '@/hooks/admin/useCreditCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreditCardsList from './CreditCardsList';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/shared/ErrorState';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, RefreshCw, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CreditCardsPage = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading, error, refetch, deleteCard } = useCreditCards();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('CreditCardsPage mounted');
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Lista atualizada",
        description: "A lista de cartões foi atualizada com sucesso."
      });
    } catch (err) {
      console.error('Error refreshing cards:', err);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um problema ao tentar atualizar a lista de cartões.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteCard = async (orderId: string) => {
    try {
      await deleteCard(orderId);
      toast({
        title: "Cartão excluído",
        description: "O cartão foi removido com sucesso."
      });
    } catch (err) {
      console.error('Error deleting card:', err);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um problema ao tentar excluir o cartão.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <ErrorState 
        title="Acesso restrito" 
        message="Você não tem permissão para acessar esta página." 
        actionLink="/admin/dashboard" 
        actionLabel="Voltar para Dashboard" 
      />
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Cartões de Crédito</CardTitle>
            <CardDescription>
              Gerenciamento de tentativas de pagamento com cartão
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" message="Carregando dados dos cartões..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Cartões de Crédito</CardTitle>
            <CardDescription>
              Gerenciamento de tentativas de pagamento com cartão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorState 
              title="Erro ao carregar dados" 
              message={`Ocorreu um erro ao carregar os cartões: ${error.message}`}
              actionLabel="Tentar novamente" 
              actionLink="/admin/credit-cards" 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Cartões de Crédito
              </CardTitle>
              <CardDescription>
                Gerenciamento de tentativas de pagamento com cartão
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data && data.length > 0 ? (
            <CreditCardsList 
              orders={data} 
              onDeleteCard={handleDeleteCard}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma tentativa de pagamento com cartão encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditCardsPage;
