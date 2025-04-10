
export async function handler(req: Request) {
  console.log('Webhook simulator API called');

  try {
    // Parse the request body
    const payload = await req.json();
    console.log('Webhook simulator payload:', payload);

    // We need to use a relative import path to avoid the vite error
    const { supabase } = await import('../../integrations/supabase/client');
    
    if (payload.event && payload.payment) {
      // Update the status of the order in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: payload.payment.status,
          updated_at: new Date().toISOString()
        })
        .eq('asaas_payment_id', payload.payment.id);

      if (error) {
        console.error('Error updating order:', error);
        return new Response(
          JSON.stringify({ 
            message: 'Error updating order', 
            error: error.message 
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Log the webhook event
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: payload.payment.id,
          status: payload.payment.status,
          payload: payload
        });

      return new Response(
        JSON.stringify({ message: 'Webhook processed successfully' }),
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
