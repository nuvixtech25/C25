
import { useState } from 'react';
import { Order, PaymentMethod, PaymentStatus } from '@/types/checkout';
import { orderAdminService } from '@/services/orders';
import { useToast } from '@/hooks/use-toast';

interface FetchOrdersParams {
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus | 'ALL';
  startDate?: Date;
  endDate?: Date;
}

export function useOrdersState() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async (filters?: FetchOrdersParams) => {
    try {
      setLoading(true);
      console.log('[useOrdersState] Fetching orders with filters:', filters);
      
      const data = await orderAdminService.getOrders(filters || {});
      
      // Log the orders received for debugging
      console.log(`[useOrdersState] Received ${data.length} orders`);
      if (data.length > 0) {
        console.log('[useOrdersState] First order payment method:', data[0].paymentMethod);
        console.log('[useOrdersState] All orders payment methods:', data.map(order => order.paymentMethod));
      }
      
      setOrders(data);
    } catch (error) {
      console.error('[useOrdersState] Error fetching orders:', error);
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
