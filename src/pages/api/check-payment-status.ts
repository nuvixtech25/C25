
import { mockCheckPaymentStatusHandler } from '../../mocks/handlers';
import { supabase } from '../../integrations/supabase/client';

export async function handler(req: Request) {
  console.log('Check payment status API called');
  
  // Parse the payment ID from URL query parameters
  const url = new URL(req.url);
  const paymentId = url.searchParams.get('paymentId');
  
  console.log(`Checking payment status for ID: ${paymentId}`);
  
  // Check if we have the payment status in the database (this would happen after webhook call)
  if (paymentId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('asaas_payment_id', paymentId)
        .maybeSingle();
      
      if (!error && data) {
        console.log(`Found payment status in database: ${data.status}`);
        
        // Create a proper JSON response with the status from database
        const response = new Response(
          JSON.stringify({
            status: data.status,
            paymentId: paymentId,
            updatedAt: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        console.log('Sending payment status response:', await response.clone().text());
        return response;
      }
    } catch (err) {
      console.error('Error fetching payment status from database:', err);
    }
  }
  
  // If no status in database or error, return default PENDING status
  const response = new Response(
    JSON.stringify({
      status: 'PENDING',
      paymentId: paymentId,
      updatedAt: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  console.log('Sending default payment status response:', await response.clone().text());
  return response;
}
