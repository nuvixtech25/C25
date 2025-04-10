
import { supabase } from "@/integrations/supabase/client";
import { Order, PaymentStatus } from "@/types/checkout";

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
      .select("*")
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

    return data as Order[];
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
