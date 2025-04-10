
// Define a type for the expected payload structure
interface WebhookPayload {
  event?: string;
  payment?: {
    id: string;
    status: string;
  };
  [key: string]: any; // Allow other properties
}

export async function handler(req: Request) {
  console.log('Webhook simulator API called');

  try {
    // Parse the request body and type cast it
    const rawPayload = await req.json();
    const payload = rawPayload as WebhookPayload;
    console.log('Webhook simulator payload:', payload);

    // We need to use a relative import path to avoid the vite error
    const { supabase } = await import('../../integrations/supabase/client');
    
    if (payload.event && payload.payment) {
      // Log payload details for debugging
      console.log(`Processing webhook for payment ${payload.payment.id} with status ${payload.payment.status}`);
      
      const paymentId = payload.payment.id;
      const newStatus = payload.payment.status;
      const updateTimestamp = new Date().toISOString();
      
      // 1. Update order status
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: updateTimestamp
        })
        .eq('asaas_payment_id', paymentId)
        .select();

      if (orderError) {
        console.error('Error updating order:', orderError);
        return new Response(
          JSON.stringify({ 
            message: 'Error updating order', 
            error: orderError.message 
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Successfully updated order:', orderData);
      
      // 2. Update asaas_payments table if it exists
      const { error: paymentsError } = await supabase
        .from('asaas_payments')
        .update({ 
          status: newStatus,
          updated_at: updateTimestamp
        })
        .eq('payment_id', paymentId);
        
      if (paymentsError) {
        console.log('Note: Could not update asaas_payments table:', paymentsError.message);
      } else {
        console.log('Successfully updated asaas_payments table');
      }

      // 3. Log the webhook event
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: paymentId,
          status: newStatus,
          payload: payload
        });

      return new Response(
        JSON.stringify({ 
          message: 'Webhook processed successfully',
          updatedOrder: orderData,
          timestamp: updateTimestamp
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid webhook payload' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Error processing webhook', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
