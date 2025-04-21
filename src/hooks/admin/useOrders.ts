
import { useState } from 'react';
import { useOrdersState } from "./orders/useOrdersState";
import { useOrdersActions } from "./orders/useOrdersActions";
import { PaymentStatus } from "@/types/checkout";
import { UseOrdersReturn } from "./orders/types";

export function useOrders(initialPaymentMethod: "pix" | "creditCard" = "pix"): UseOrdersReturn {
  const { orders, loading, fetchOrders, setOrders, setLoading } = useOrdersState();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "creditCard">(initialPaymentMethod);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "custom">("7days");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined
  });
  
  // Calculate summary based on filtered orders
  const ordersSummary = {
    count: orders.length,
    totalValue: orders.reduce((total, order) => total + Number(order.productPrice), 0)
  };

  const ordersActions = useOrdersActions(
    orders, 
    paymentMethod, 
    fetchOrders
  );

  const changePaymentMethod = (method: "pix" | "creditCard") => {
    setPaymentMethod(method);
    // Refresh orders when payment method changes
    fetchOrders({ paymentMethod: method, status: statusFilter });
  };

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
    updateOrderStatus: ordersActions.updateOrderStatus,
    deleteOrder: ordersActions.deleteOrder,
    deleteAllOrders: ordersActions.deleteAllOrders,
    fetchOrders
  };
}
