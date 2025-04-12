
import { useState, useEffect, useMemo } from "react";
import { orderAdminService } from "@/services/orderAdminService";
import { Order, PaymentStatus } from "@/types/checkout";
import { useToast } from "@/hooks/use-toast";
import { addDays, startOfDay, endOfDay } from "date-fns";

type DateRangeType = "7days" | "30days" | "custom";

export function useOrders(initialPaymentMethod: "pix" | "creditCard" = "pix") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "creditCard">(initialPaymentMethod);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<DateRangeType>("7days");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const { toast } = useToast();

  // Calculate date range filters based on selection
  const dateFilters = useMemo(() => {
    const today = new Date();
    
    if (dateRange === "custom" && customDateRange.startDate && customDateRange.endDate) {
      return {
        startDate: startOfDay(customDateRange.startDate),
        endDate: endOfDay(customDateRange.endDate),
      };
    } else if (dateRange === "7days") {
      return {
        startDate: startOfDay(addDays(today, -7)),
        endDate: endOfDay(today),
      };
    } else if (dateRange === "30days") {
      return {
        startDate: startOfDay(addDays(today, -30)),
        endDate: endOfDay(today),
      };
    }
    
    return {
      startDate: undefined,
      endDate: undefined,
    };
  }, [dateRange, customDateRange]);

  // Summary calculations
  const ordersSummary = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.productPrice), 0);
    
    return {
      count: orders.length,
      totalValue: total,
    };
  }, [orders]);

  // Fetch orders with current filters
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderAdminService.getOrders({
        paymentMethod,
        status: statusFilter,
        startDate: dateFilters.startDate,
        endDate: dateFilters.endDate,
      });
      setOrders(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update an order's status
  const updateOrderStatus = async (orderId: string, status: PaymentStatus) => {
    try {
      await orderAdminService.updateOrderStatus(orderId, status);
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso",
      });
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Delete a single order
  const deleteOrder = async (orderId: string) => {
    try {
      console.log("Attempting to delete order:", orderId);
      const result = await orderAdminService.deleteOrder(orderId);
      console.log("Delete order result:", result);
      
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso",
      });
      
      // Update local state to remove the deleted order
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir pedido",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Delete all orders for current payment method
  const deleteAllOrders = async () => {
    try {
      console.log(`Attempting to delete all ${paymentMethod} orders`);
      const result = await orderAdminService.deleteOrdersByPaymentMethod(paymentMethod);
      console.log("Delete all orders result:", result);
      
      toast({
        title: "Pedidos excluídos",
        description: `Todos os pedidos de ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'} foram excluídos`,
      });
      
      // Refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error("Error deleting all orders:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Change the payment method tab and fetch relevant orders
  const changePaymentMethod = (method: "pix" | "creditCard") => {
    setPaymentMethod(method);
  };

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [paymentMethod, statusFilter, dateFilters]);

  return {
    orders,
    loading,
    paymentMethod,
    statusFilter,
    dateRange,
    customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrders,
    fetchOrders,
  };
}
