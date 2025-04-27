import { supabase } from "@/integrations/supabase/client";
import { GetOrdersParams, OrderTransformed } from "./types";

export const getOrders = async ({
  paymentMethod,
  status,
  startDate,
  endDate,
}: GetOrdersParams): Promise<OrderTransformed[]> => {
  try {
    console.log("[getOrders] Iniciando busca de pedidos com parâmetros:", {
      paymentMethod,
      status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    });

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Aplicar filtro de método de pagamento se fornecido
    if (paymentMethod) {
      console.log(
        `[getOrders] Filtrando por método de pagamento: ${paymentMethod}`,
      );
      query = query.eq("payment_method", paymentMethod);
    }

    // Aplicar filtro de status se não for "ALL"
    if (status && status !== "ALL") {
      console.log(`[getOrders] Filtrando por status: ${status}`);
      query = query.eq("status", status);
    }

    // Aplicar filtro de data se ambas as datas forem fornecidas
    if (startDate && endDate) {
      // Garantir que as datas sejam convertidas corretamente para strings ISO
      const formatDate = (date: string | Date) => {
        if (typeof date === "string") {
          return date;
        } else if (date instanceof Date) {
          return date.toISOString();
        } else {
          try {
            return new Date(date).toISOString();
          } catch (err) {
            console.error("[getOrders] Erro ao converter data:", date, err);
            return new Date().toISOString();
          }
        }
      };

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      console.log("[getOrders] Aplicando filtros de data:", {
        startDateStr,
        endDateStr,
      });

      query = query.gte("created_at", startDateStr);
      query = query.lte("created_at", endDateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getOrders] Erro ao buscar pedidos:", error);
      throw new Error(`Falha ao buscar pedidos: ${error.message}`);
    }

    console.log(`[getOrders] Pedidos encontrados: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log("[getOrders] Primeiro pedido:", {
        id: data[0].id,
        paymentMethod: data[0].payment_method,
        status: data[0].status,
      });
    }

    // Transform the data to match OrderTransformed type (snake_case keys)
    const transformedData: OrderTransformed[] = (data || []).map((order) => ({
      id: order.id,
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_cpf_cnpj: order.customer_cpf_cnpj,
      product_id: order.product_id,
      product_name: order.product_name,
      product_price:
        typeof order.product_price === "number" ||
        !isNaN(Number(order.product_price))
          ? Number(order.product_price)
          : 0,
      payment_method: order.payment_method,
      created_at: order.created_at,
      updated_at: order.updated_at,
      status: order.status,
      asaas_payment_id: order.asaas_payment_id,
    }));

    // Log transformed data payment methods for debugging
    if (transformedData.length > 0) {
      const paymentMethods = transformedData.map(
        (order) => order.payment_method,
      );
      console.log(
        "[getOrders] Transformed data payment methods:",
        paymentMethods,
      );
    }

    return transformedData;
  } catch (err) {
    console.error("[getOrders] Erro inesperado:", err);
    throw err;
  }
};
