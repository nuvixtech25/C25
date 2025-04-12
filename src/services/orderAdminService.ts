
import { PaymentStatus } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";

interface GetOrdersParams {
  paymentMethod: "pix" | "creditCard";
  status: PaymentStatus | "ALL";
  startDate?: Date;
  endDate?: Date;
}

const getOrders = async ({
  paymentMethod,
  status,
  startDate,
  endDate,
}: GetOrdersParams) => {
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

  // Validate and transform the data
  return (data || []).map(order => ({
    ...order,
    // Ensure productPrice is a valid number
    productPrice: typeof order.product_price === 'number' || !isNaN(Number(order.product_price)) 
      ? Number(order.product_price) 
      : 0,
    // Map database columns to frontend properties
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
};

const updateOrderStatus = async (
  orderId: string,
  status: PaymentStatus
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return data;
};

// Enhanced version of the deleteOrder method to ensure proper deletion
const deleteOrder = async (orderId: string) => {
  console.log(`Deleting order with ID: ${orderId}`);
  
  try {
    // First, check if there's any associated payment in asaas_payments
    const { data: paymentData, error: paymentError } = await supabase
      .from('asaas_payments')
      .select('id')
      .eq('order_id', orderId);
      
    if (paymentError) {
      console.error('Error checking associated payment:', paymentError);
      throw new Error(`Failed to check associated payment: ${paymentError.message}`);
    }
      
    if (paymentData && paymentData.length > 0) {
      console.log(`Found associated payment for order ${orderId}, deleting it first`);
      const { error: deletePaymentError } = await supabase
        .from('asaas_payments')
        .delete()
        .eq('order_id', orderId);
        
      if (deletePaymentError) {
        console.error('Error deleting associated payment:', deletePaymentError);
        throw new Error(`Failed to delete associated payment: ${deletePaymentError.message}`);
      }
    }
    
    // Check if there's any card data associated with this order
    const { data: cardData, error: cardError } = await supabase
      .from('card_data')
      .select('id')
      .eq('order_id', orderId);
      
    if (cardError) {
      console.error('Error checking associated card data:', cardError);
      throw new Error(`Failed to check associated card data: ${cardError.message}`);
    }
      
    if (cardData && cardData.length > 0) {
      console.log(`Found associated card data for order ${orderId}, deleting it first`);
      const { error: deleteCardError } = await supabase
        .from('card_data')
        .delete()
        .eq('order_id', orderId);
        
      if (deleteCardError) {
        console.error('Error deleting associated card data:', deleteCardError);
        throw new Error(`Failed to delete associated card data: ${deleteCardError.message}`);
      }
    }

    // Now delete the order itself
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      throw new Error(`Failed to delete order: ${error.message}`);
    }
    
    console.log(`Successfully deleted order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteOrder function:', error);
    throw error;
  }
};

// Improved deleteOrdersByPaymentMethod function to fix the issue with delete all PIX orders
const deleteOrdersByPaymentMethod = async (paymentMethod: 'pix' | 'creditCard') => {
  console.log(`Deleting all orders with payment method: ${paymentMethod}`);
  
  try {
    // First, get all the order IDs with this payment method
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, asaas_payment_id')
      .eq('payment_method', paymentMethod);
      
    if (fetchError) {
      console.error('Error fetching orders to delete:', fetchError);
      throw new Error(`Failed to fetch orders to delete: ${fetchError.message}`);
    }
    
    if (!orders || orders.length === 0) {
      console.log(`No ${paymentMethod} orders found to delete`);
      return { success: true, count: 0 };
    }
    
    console.log(`Found ${orders.length} ${paymentMethod} orders to delete`);
    
    // Delete each order individually to ensure related records are properly deleted
    let deletedCount = 0;
    let errors = [];
    
    for (const order of orders) {
      try {
        await deleteOrder(order.id);
        deletedCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Failed to delete order ${order.id}:`, errorMessage);
        errors.push({ orderId: order.id, error: errorMessage });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Completed with ${errors.length} errors:`, errors);
      return { 
        success: deletedCount > 0, 
        count: deletedCount,
        errors: errors
      };
    }
    
    console.log(`Successfully deleted ${deletedCount} orders`);
    return { success: true, count: deletedCount };
  } catch (error) {
    console.error('Error in deleteOrdersByPaymentMethod function:', error);
    throw error;
  }
};

// Export all functions as a service object
export const orderAdminService = {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  deleteOrdersByPaymentMethod
};
