
import { supabase } from "@/integrations/supabase/client";
import { GetOrdersParams, OrderTransformed } from "./types";
import { PaymentStatus } from "@/types/checkout";

export const getOrders = async ({
  paymentMethod,
  status,
  startDate,
  endDate,
}: GetOrdersParams): Promise<OrderTransformed[]> => {
  let query = supabase
    .from("orders")
    .select("*")
    .eq("payment_method", paymentMethod)
    .order("created_at", { ascending: false });

  if (status !== "ALL") {
    query = query.eq("status", status);
  }

  if (startDate && endDate) {
    query = query.gte("created_at", startDate.toISOString());
    query = query.lte("created_at", endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  // Transform the data to match the OrderTransformed interface
  return (data || []).map(order => ({
    id: order.id,
    customerId: order.customer_id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    customerCpfCnpj: order.customer_cpf_cnpj,
    productId: order.product_id || '', // Ensure productId is always provided
    productName: order.product_name,
    productPrice: typeof order.product_price === 'number' || !isNaN(Number(order.product_price)) 
      ? Number(order.product_price) 
      : 0,
    paymentMethod: order.payment_method,
    createdAt: order.created_at,
    updatedAt: order.updated_at, // Ensure updatedAt is included
    status: order.status as PaymentStatus,
    asaasPaymentId: order.asaas_payment_id
  }));
};
