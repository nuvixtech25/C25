
export async function handler(req: Request) {
  console.log('Mock payment API called');
  
  // Create a response that matches the format from the Netlify function
  return new Response(
    JSON.stringify({
      paymentId: 'mock_payment_' + Date.now(),
      qrCode: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
      qrCodeImage: '/placeholder.svg',
      qrCodeImageUrl: '/placeholder.svg',
      copyPasteKey: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
      expirationDate: new Date(Date.now() + 30 * 60000).toISOString(),
      status: 'PENDING'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
