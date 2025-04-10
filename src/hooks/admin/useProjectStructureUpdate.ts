
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useProjectStructureUpdate = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Simulando uma atualização que leva tempo
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsUpdating(false);
      
      toast({
        title: "Informações atualizadas",
        description: "A estrutura do projeto foi atualizada com sucesso.",
        variant: "default",
      });
    }, 1000);
  };

  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return {
    lastUpdated,
    isUpdating,
    handleRefresh,
    formatLastUpdated
  };
};
