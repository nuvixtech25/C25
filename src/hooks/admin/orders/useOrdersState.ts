
import { useState, useEffect, useRef } from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import { orderAdminService } from "@/services/orders";
import { useToast } from "@/hooks/use-toast";
import { calculateDateFilters } from "./dateUtils";
import { calculateOrdersSummary } from "./orderSummary";
import { DateRangeType, OrdersFilterState, UseOrdersReturn } from "./types";

export function useOrdersState(initialPaymentMethod: "pix" | "creditCard" = "pix"): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrdersFilterState>({
    paymentMethod: initialPaymentMethod,
    statusFilter: "ALL",
    dateRange: "7days",
    customDateRange: {
      startDate: undefined,
      endDate: undefined,
    }
  });
  const { toast } = useToast();
  const isMounted = useRef(true);

  // Calculate date range filters based on selection
  const dateFilters = calculateDateFilters(filters.dateRange, filters.customDateRange);

  // Summary calculations
  const ordersSummary = calculateOrdersSummary(orders);

  // Fetch orders with current filters
  const fetchOrders = async () => {
    console.log("Fetching orders with filters:", { 
      paymentMethod: filters.paymentMethod, 
      statusFilter: filters.statusFilter, 
      dateFilters 
    });
    
    setLoading(true);
    try {
      const data = await orderAdminService.getOrders({
        paymentMethod: filters.paymentMethod,
        status: filters.statusFilter,
        startDate: dateFilters.startDate,
        endDate: dateFilters.endDate,
      });
      
      console.log("Orders fetched:", data);
      
      if (!isMounted.current) return;
      
      // Convert the OrderTransformed[] to Order[]
      const transformedOrders: Order[] = data.map(order => ({
        id: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerCpfCnpj: order.customerCpfCnpj,
        productId: order.productId,
        productName: order.productName,
        productPrice: order.productPrice,
        status: order.status as PaymentStatus,
        paymentMethod: order.paymentMethod as "pix" | "creditCard",
        asaasPaymentId: order.asaasPaymentId || undefined,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: error instanceof Error ? error.message : "Erro desconhecido",
        });
        // Definindo orders como array vazio em caso de erro
        setOrders([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Update filters
  const setStatusFilter = (status: PaymentStatus | "ALL") => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const setDateRange = (range: DateRangeType) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const setCustomDateRange = (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    setFilters(prev => ({ ...prev, customDateRange: range }));
  };

  const changePaymentMethod = (method: "pix" | "creditCard") => {
    setFilters(prev => ({ ...prev, paymentMethod: method }));
  };

  // Fetch orders when filters change
  useEffect(() => {
    console.log("Filters changed, fetching orders...");
    fetchOrders();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [
    filters.paymentMethod, 
    filters.statusFilter, 
    dateFilters.startDate, 
    dateFilters.endDate
  ]);
  
  // Reset isMounted ref on mount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    orders,
    loading,
    paymentMethod: filters.paymentMethod,
    statusFilter: filters.statusFilter,
    dateRange: filters.dateRange,
    customDateRange: filters.customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    updateOrderStatus: async () => {}, // Will be implemented in useOrdersActions
    deleteOrder: async () => {}, // Will be implemented in useOrdersActions
    deleteAllOrders: async () => {}, // Will be implemented in useOrdersActions
    fetchOrders,
  };
}
