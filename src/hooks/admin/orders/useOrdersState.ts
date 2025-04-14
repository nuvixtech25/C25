
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
  const isFirstRender = useRef(true);
  const previousFilterRef = useRef<string>('');

  // Calcular filtros de data baseados na seleção
  const dateFilters = calculateDateFilters(filters.dateRange, filters.customDateRange);

  // Cálculos de resumo
  const ordersSummary = calculateOrdersSummary(orders);

  // Buscar pedidos com filtros atuais
  const fetchOrders = async () => {
    // Criar uma string para comparação de filtros
    const currentFilterString = JSON.stringify({
      paymentMethod: filters.paymentMethod,
      statusFilter: filters.statusFilter,
      startDate: dateFilters.startDate,
      endDate: dateFilters.endDate
    });

    // Se os filtros não mudaram, não refazer a busca
    if (currentFilterString === previousFilterRef.current && !isFirstRender.current) {
      console.log("Filtros não mudaram, ignorando busca duplicada");
      return;
    }

    console.log("Buscando pedidos com filtros:", { 
      paymentMethod: filters.paymentMethod, 
      statusFilter: filters.statusFilter, 
      dateFilters 
    });
    
    setLoading(true);
    previousFilterRef.current = currentFilterString;
    isFirstRender.current = false;

    try {
      const data = await orderAdminService.getOrders({
        paymentMethod: filters.paymentMethod,
        status: filters.statusFilter,
        startDate: dateFilters.startDate,
        endDate: dateFilters.endDate,
      });
      
      console.log("Pedidos obtidos:", data);
      
      if (!isMounted.current) return;
      
      // Converter OrderTransformed[] para Order[]
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
      console.error("Erro ao buscar pedidos:", error);
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

  // Atualizar filtros
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

  // Buscar pedidos quando os filtros mudarem
  useEffect(() => {
    fetchOrders();
    
    // Função de limpeza para evitar atualizações de estado após desmontagem
    return () => {
      isMounted.current = false;
    };
  }, [
    filters.paymentMethod, 
    filters.statusFilter, 
    filters.dateRange,
    JSON.stringify(filters.customDateRange)
  ]);
  
  // Resetar isMounted ref ao montar
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
    updateOrderStatus: async () => {}, // Será implementado em useOrdersActions
    deleteOrder: async () => {}, // Será implementado em useOrdersActions
    deleteAllOrders: async () => {}, // Será implementado em useOrdersActions
    fetchOrders,
  };
}
