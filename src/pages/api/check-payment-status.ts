
import { mockCheckPaymentStatusHandler } from '../../mocks/handlers';

export async function handler(req: Request) {
  console.log('Check payment status API called');
  
  // Parse the payment ID from URL query parameters
  const url = new URL(req.url);
  const paymentId = url.searchParams.get('paymentId');
  
  console.log(`Checking payment status for ID: ${paymentId}`);
  
  // Delegate to our mock handler
  return mockCheckPaymentStatusHandler(req);
}
