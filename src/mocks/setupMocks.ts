
import { mockAsaasPaymentHandler, mockCheckPaymentStatusHandler } from './handlers';

// Setup mock API routes for Vite development server
export function setupMocks() {
  // Register the handler for all /api/* routes
  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle mock payment API
    if (url.pathname === '/api/mock-asaas-payment') {
      event.respondWith(mockAsaasPaymentHandler(event.request));
      return;
    }
    
    // Handle mock payment status check (for local testing)
    if (url.pathname === '/api/check-payment-status') {
      event.respondWith(mockCheckPaymentStatusHandler(event.request));
      return;
    }
    
    // For all other routes, let the browser handle the request normally
  });
}
