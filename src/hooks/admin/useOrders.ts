
import { useState, useEffect } from 'react';
import { useOrdersState } from "./orders/useOrdersState";
import { useOrdersActions } from "./orders/useOrdersActions";
import { PaymentStatus, PaymentMethod } from "@/types/checkout";
import { UseOrdersReturn } from "./orders/types";

export function useOrders(initialPaymentMethod: PaymentMethod = "pix"): UseOrdersReturn {
  const { orders, loading, fetchOrders, setOrders, setLoading } = useOrdersState();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "custom">("7days");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined
  });
  
  // Fetch orders when component mounts or when filters change
  useEffect(() => {
    console.log(`[useOrders] Fetching orders with payment method: ${paymentMethod}, status: ${statusFilter}`);
    fetchOrders({ 
      paymentMethod: paymentMethod, 
      status: statusFilter,
      startDate: customDateRange.startDate,
      endDate: customDateRange.endDate
    });
  }, [paymentMethod, statusFilter, dateRange, 
      customDateRange.startDate, customDateRange.endDate]);
  
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

  const changePaymentMethod = (method: PaymentMethod) => {
    console.log(`[useOrders] Changing payment method to: ${method}`);
    setPaymentMethod(method);
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
