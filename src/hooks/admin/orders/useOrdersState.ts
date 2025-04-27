import { useState } from "react";
import { Order, PaymentMethod, PaymentStatus } from "@/types/checkout";
import { orderAdminService } from "@/services/orders";
import { useToast } from "@/hooks/use-toast";
import { OrderTransformed } from "@/services/orders/types";

interface FetchOrdersParams {
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus | "ALL";
  startDate?: Date;
  endDate?: Date;
}

// Helper function to convert from OrderTransformed to Order
const transformToOrder = (orderData: OrderTransformed): Order => ({
  id: orderData.id,
  customerId: orderData.customer_id,
  customerName: orderData.customer_name,
  customerEmail: orderData.customer_email,
  customerPhone: orderData.customer_phone,
  customerCpfCnpj: orderData.customer_cpf_cnpj,
  productId: orderData.product_id,
  productName: orderData.product_name,
  productPrice: orderData.product_price,
  status: orderData.status,
  paymentMethod: orderData.payment_method,
  asaasPaymentId: orderData.asaas_payment_id,
  createdAt: orderData.created_at,
  updatedAt: orderData.updated_at,
});

export function useOrdersState() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async (filters?: FetchOrdersParams) => {
    try {
      setLoading(true);
      console.log("[useOrdersState] Fetching orders with filters:", filters);

      const data = await orderAdminService.getOrders(filters || {});

      // Log the orders received for debugging
      console.log(`[useOrdersState] Received ${data.length} orders`);
      if (data.length > 0) {
        console.log(
          "[useOrdersState] First order payment method:",
          data[0].payment_method,
        );
        console.log(
          "[useOrdersState] All orders payment methods:",
          data.map((order) => order.payment_method),
        );
      }

      // Convert the OrderTransformed objects to Order objects
      const transformedOrders = data.map(transformToOrder);
      setOrders(transformedOrders);
    } catch (error) {
      console.error("[useOrdersState] Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pedidos",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
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
    fetchOrders,
  };
}
