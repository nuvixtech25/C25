
import { PaymentStatus } from "@/types/checkout";

// Mock Asaas API response data
export const mockAsaasPaymentResponse = {
  paymentId: 'mock_payment_123',
  qrCode: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
  qrCodeImage: 'https://via.placeholder.com/300x300.png?text=QR+PIX',
  qrCodeImageUrl: 'https://via.placeholder.com/300x300.png?text=QR+PIX',
  copyPasteKey: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
  expirationDate: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
  status: 'PENDING' as PaymentStatus,
};

// Handler function for mock Asaas payment API
export async function mockAsaasPaymentHandler(req: Request) {
  // Log the request for debugging
  console.log('Mock API request received:', req.url, req.method);
  
  try {
    // Parse the request body if it exists
    const body = req.method === 'POST' ? await req.json() : null;
    console.log('Request body:', body);
    
    // Return mock response
    return new Response(
      JSON.stringify(mockAsaasPaymentResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in mock handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Check payment status mock handler
export async function mockCheckPaymentStatusHandler(req: Request) {
  // Extract payment ID from URL if needed
  const url = new URL(req.url);
  const paymentId = url.searchParams.get('paymentId');
  
  console.log('Mock payment status check for ID:', paymentId);
  
  // Always return PENDING for mock (you could add logic to simulate other states if needed)
  return new Response(
    JSON.stringify({ status: 'PENDING' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
