
import { useEffect, useState } from 'react';
import { Order, PaymentStatus } from '@/types/checkout';
import { orderAdminService } from '@/services/orders';
import { useToast } from '@/hooks/use-toast';
import { useFilterContext } from './OrderFilterContext';
import { useOrdersState } from './useOrdersState';
import { usePagination } from './usePagination';

export function useOrdersList() {
  const { toast } = useToast();
  const { orders, loading, setOrders, setLoading } = useOrdersState();
  const { filters } = useFilterContext();
  const { currentPage, itemsPerPage, paginate } = usePagination();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAdminService.getOrders({
        paymentMethod: filters.paymentMethod,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      
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

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Calculate paginated data
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    orders: paginatedOrders,
    totalOrders: orders.length,
    loading,
    currentPage,
    itemsPerPage,
    paginate,
    refreshOrders: fetchOrders
  };
}
