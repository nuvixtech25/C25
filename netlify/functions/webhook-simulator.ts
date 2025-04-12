
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define the type for the expected payload structure
interface WebhookPayload {
  event?: string;
  payment?: {
    id: string;
    status: string;
  };
  orderId?: string; // Add orderId for manual card payments
  [key: string]: any; // Allow other properties
}

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  console.log('Webhook simulator function called');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const payload = JSON.parse(event.body || '{}') as WebhookPayload;
    console.log('Webhook simulator payload:', payload);

    if (payload.event && payload.payment) {
      // Check if this is a manual card payment (special case)
      const isManualCardPayment = payload.payment.id === 'manual_card_payment' && payload.orderId;
      
      // Log payload details for debugging
      if (isManualCardPayment) {
        console.log(`Processing manual card webhook for order ${payload.orderId} with event ${payload.event}`);
      } else {
        console.log(`Processing webhook for payment ${payload.payment.id} with event ${payload.event} and status ${payload.payment.status}`);
      }
      
      const newStatus = payload.payment.status;
      const updateTimestamp = new Date().toISOString();
      
      // 1. Update order status - handle both asaas_payment_id and manual card (orderId)
      let orderData;
      let orderError;
      
      if (isManualCardPayment && payload.orderId) {
        // For manual card payments, use the orderId directly
        const result = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('id', payload.orderId)
          .select();
          
        orderData = result.data;
        orderError = result.error;
      } else {
        // For regular Asaas payments, use the payment_id
        const result = await supabase
          .from('orders')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('asaas_payment_id', payload.payment.id)
          .select();
          
        orderData = result.data;
        orderError = result.error;
      }

      if (orderError) {
        console.error('Error updating order:', orderError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            message: 'Error updating order', 
            error: orderError.message 
          })
        };
      }

      console.log('Successfully updated order:', orderData);
      
      // 2. Update asaas_payments table if it exists and if this is not a manual card payment
      if (!isManualCardPayment) {
        const { error: paymentsError } = await supabase
          .from('asaas_payments')
          .update({ 
            status: newStatus,
            updated_at: updateTimestamp
          })
          .eq('payment_id', payload.payment.id);
          
        if (paymentsError) {
          console.log('Note: Could not update asaas_payments table:', paymentsError.message);
        } else {
          console.log('Successfully updated asaas_payments table');
        }
      }

      // 3. Log the webhook event
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: isManualCardPayment ? `manual_${payload.orderId}` : payload.payment.id,
          status: newStatus,
          payload: payload
        });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Webhook processed successfully',
          updatedOrder: orderData,
          timestamp: updateTimestamp,
          isManualCard: isManualCardPayment,
          event: payload.event
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid webhook payload' })
      };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error processing webhook', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    };
  }
};
