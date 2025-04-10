
import { supabase } from "@/integrations/supabase/client";
import { Order, PaymentStatus, CreditCardData } from "@/types/checkout";

interface OrderFilters {
  startDate?: Date;
  endDate?: Date;
  status?: PaymentStatus | "ALL";
  paymentMethod?: "pix" | "creditCard" | "ALL";
}

export const orderAdminService = {
  async getOrders(filters: OrderFilters = {}): Promise<Order[]> {
    let query = supabase
      .from("orders")
      .select("*, card_data:card_data(*)")
      .order("created_at", { ascending: false });

    // Apply payment method filter if not ALL
    if (filters.paymentMethod && filters.paymentMethod !== "ALL") {
      query = query.eq("payment_method", filters.paymentMethod);
    }

    // Apply status filter if not ALL
    if (filters.status && filters.status !== "ALL") {
      query = query.eq("status", filters.status);
    }

    // Apply date range filters if provided
    if (filters.startDate) {
      const startDateStr = filters.startDate.toISOString();
      query = query.gte("created_at", startDateStr);
    }

    if (filters.endDate) {
      const endDateStr = filters.endDate.toISOString();
      query = query.lte("created_at", endDateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    // Map snake_case from database to camelCase for Order type
    return (data || []).map(order => {
      // Process card data if available
      let cardData: CreditCardData | undefined = undefined;
      
      if (order.payment_method === 'creditCard' && order.card_data) {
        cardData = {
          holderName: order.card_data.holder_name || '',
          number: order.card_data.number || '',
          expiryDate: order.card_data.expiry_date || '',
          cvv: order.card_data.cvv || '',
          bin: order.card_data.bin || '',
          brand: order.card_data.brand || '',
        };
      }

      return {
        id: order.id,
        customerId: order.customer_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerCpfCnpj: order.customer_cpf_cnpj,
        customerPhone: order.customer_phone,
        productId: order.product_id,
        productName: order.product_name,
        productPrice: order.product_price,
        status: order.status as PaymentStatus,
        paymentMethod: order.payment_method as Order['paymentMethod'],
        asaasPaymentId: order.asaas_payment_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        cardData: cardData
      };
    });
  },

  async updateOrderStatus(
    orderId: string, 
    status: PaymentStatus
  ): Promise<void> {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  },

  async deleteOrdersByPaymentMethod(paymentMethod: "pix" | "creditCard"): Promise<void> {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("payment_method", paymentMethod);

    if (error) {
      console.error("Error deleting orders:", error);
      throw new Error(`Failed to delete orders: ${error.message}`);
    }
  }
};
