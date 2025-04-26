
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
      endDate: endDate ? new Date(endDate).toISOString() : null
    });
    
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Aplicar filtro de método de pagamento se fornecido
    if (paymentMethod) {
      console.log(`[getOrders] Filtrando por método de pagamento: ${paymentMethod}`);
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
        if (typeof date === 'string') {
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
      
      console.log("[getOrders] Aplicando filtros de data:", { startDateStr, endDateStr });
      
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
        status: data[0].status
      });
    }
    
    // Validar e transformar os dados
    const transformedData = (data || []).map(order => ({
      ...order,
      id: order.id,
      productPrice: typeof order.product_price === 'number' || !isNaN(Number(order.product_price)) 
        ? Number(order.product_price) 
        : 0,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerCpfCnpj: order.customer_cpf_cnpj,
      customerId: order.customer_id,
      productName: order.product_name,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
      status: order.status,
      asaasPaymentId: order.asaas_payment_id
    }));
    
    return transformedData;
  } catch (err) {
    console.error("[getOrders] Erro inesperado:", err);
    throw err;
  }
}
