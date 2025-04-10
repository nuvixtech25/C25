
export async function handler(req: Request) {
  console.log('Mock payment status check API called');
  
  // Get payment ID from query string if needed
  const url = new URL(req.url);
  const paymentId = url.searchParams.get('paymentId');
  console.log('Checking status for payment ID:', paymentId);
  
  // Return mock pending status (you could add logic to simulate different statuses if needed)
  return new Response(
    JSON.stringify({ status: 'PENDING' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
