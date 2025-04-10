
export async function handler(req: Request) {
  return new Response(
    JSON.stringify({
      qrCode: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
      qrCodeImageUrl: 'https://via.placeholder.com/300x300.png?text=QR+PIX',
      paymentId: 'mock_payment_123',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
