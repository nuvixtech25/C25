import { PaymentStatus } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";

interface GetOrdersParams {
  paymentMethod: "pix" | "creditCard";
  status: PaymentStatus | "ALL";
  startDate?: Date;
  endDate?: Date;
}

export const getOrders = async ({
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

  return data || [];
};

export const updateOrderStatus = async (
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

// This is an enhanced version of the deleteOrder method to fix deletion issues
export const deleteOrder = async (orderId: string) => {
  console.log(`Deleting order with ID: ${orderId}`);
  
  try {
    // First, check if there's any associated payment in asaas_payments
    const { data: paymentData } = await supabase
      .from('asaas_payments')
      .select('id')
      .eq('order_id', orderId)
      .single();
      
    if (paymentData) {
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
    const { data: cardData } = await supabase
      .from('card_data')
      .select('id')
      .eq('order_id', orderId)
      .single();
      
    if (cardData) {
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

// Also enhancing the deleteOrdersByPaymentMethod function
export const deleteOrdersByPaymentMethod = async (paymentMethod: 'pix' | 'creditCard') => {
  console.log(`Deleting all orders with payment method: ${paymentMethod}`);
  
  try {
    // First, get all the order IDs with this payment method
    const { data: orderIds, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_method', paymentMethod);
      
    if (fetchError) {
      console.error('Error fetching orders to delete:', fetchError);
      throw new Error(`Failed to fetch orders to delete: ${fetchError.message}`);
    }
    
    const ids = orderIds?.map(order => order.id) || [];
    console.log(`Found ${ids.length} orders to delete`);
    
    if (ids.length === 0) {
      return { success: true, count: 0 };
    }
    
    // Delete associated asaas_payments first
    const { error: paymentsError } = await supabase
      .from('asaas_payments')
      .delete()
      .in('order_id', ids);
      
    if (paymentsError) {
      console.error('Error deleting associated payments:', paymentsError);
      // Continue anyway, as not all orders might have payments
    }
    
    // Delete associated card_data if any
    const { error: cardError } = await supabase
      .from('card_data')
      .delete()
      .in('order_id', ids);
      
    if (cardError) {
      console.error('Error deleting associated card data:', cardError);
      // Continue anyway, as not all orders might have card data
    }
    
    // Now delete the orders
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('payment_method', paymentMethod);
      
    if (deleteError) {
      console.error('Error deleting orders:', deleteError);
      throw new Error(`Failed to delete orders: ${deleteError.message}`);
    }
    
    console.log(`Successfully deleted ${ids.length} orders`);
    return { success: true, count: ids.length };
  } catch (error) {
    console.error('Error in deleteOrdersByPaymentMethod function:', error);
    throw error;
  }
};
