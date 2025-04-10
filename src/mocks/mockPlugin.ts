
import type { Plugin } from 'vite';

export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        
        // Handle mock payment API
        if (url.startsWith('/api/mock-asaas-payment')) {
          // Read the request body
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', () => {
            // Parse the body
            let parsedBody = {};
            if (body) {
              try {
                parsedBody = JSON.parse(body);
              } catch (e) {
                console.error('Failed to parse request body:', e);
              }
            }
            
            // Create mock response
            const mockResponse = {
              paymentId: 'mock_payment_' + Date.now(),
              qrCode: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
              qrCodeImage: '/placeholder.svg', // Use local placeholder SVG
              qrCodeImageUrl: '/placeholder.svg', // Use local placeholder SVG
              copyPasteKey: '00020101021226890014br.gov.bcb.pix2554qrcodepix.exemplo.bcb.gov.br/teste12345678901234567890204000053039865802BR5924Mock Pagador6009Sao Paulo62070503***6304B13E',
              expirationDate: new Date(Date.now() + 30 * 60000).toISOString(),
              status: 'PENDING',
              value: parsedBody?.value || 99.90,
              description: parsedBody?.description || 'Pagamento de teste'
            };
            
            // Log for debugging
            console.log('Mock API request:', url);
            console.log('Request body:', parsedBody);
            console.log('Responding with:', mockResponse);
            
            // Send response
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mockResponse));
          });
          return;
        }
        
        // Handle mock payment status check
        if (url.startsWith('/api/check-payment-status')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'PENDING' }));
          return;
        }
        
        // Let other requests pass through
        next();
      });
    }
  };
}
