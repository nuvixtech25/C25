import { useEffect, useState } from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import { orderAdminService } from "@/services/orders";
import { useToast } from "@/hooks/use-toast";
import { useFilterContext } from "./OrderFilterContext";
import { usePagination } from "./usePagination";
import { OrderTransformed } from "@/services/orders/types";

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

export function useOrdersList() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilterContext();
  const { currentPage, itemsPerPage, paginate } = usePagination();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("[useOrdersList] Fetching orders with filters:", filters);

      const data = await orderAdminService.getOrders({
        paymentMethod: filters.paymentMethod,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      console.log(
        `[useOrdersList] Received ${data.length} orders, payment method: ${filters.paymentMethod}`,
      );
      if (data.length > 0) {
        const paymentMethods = data.map((order) => order.payment_method);
        console.log("[useOrdersList] Orders payment methods:", paymentMethods);
      }

      // Convert the OrderTransformed objects to Order objects
      const transformedOrders = data.map(transformToOrder);
      setOrders(transformedOrders);
    } catch (error) {
      console.error("[useOrdersList] Error fetching orders:", error);
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

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Calculate paginated data
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return {
    orders: paginatedOrders,
    totalOrders: orders.length,
    loading,
    currentPage,
    itemsPerPage,
    paginate,
    refreshOrders: fetchOrders,
  };
}
