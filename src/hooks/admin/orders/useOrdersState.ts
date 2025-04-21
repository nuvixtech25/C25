
import { useState } from 'react';
import { Order } from '@/types/checkout';
import { orderAdminService } from '@/services/orders';
import { useToast } from '@/hooks/use-toast';

export function useOrdersState() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async (filters?: any) => {
    try {
      setLoading(true);
      const data = await orderAdminService.getOrders(filters || {});
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    setOrders,
    setLoading,
    fetchOrders
  };
}
