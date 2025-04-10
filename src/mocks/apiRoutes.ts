
import { IncomingMessage, ServerResponse } from 'http';
import { mockAsaasPaymentHandler, mockCheckPaymentStatusHandler } from './handlers';

// Extend IncomingMessage type to allow for body property
interface ExtendedIncomingMessage extends IncomingMessage {
  body?: any;
}

// CORS headers to allow access from various domains
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export const apiRoutesMiddleware = async (
  req: ExtendedIncomingMessage, 
  res: ServerResponse, 
  next: () => void
) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  
  // Set CORS headers for all API routes
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Process API routes
  try {
    // Mock Asaas payment endpoint
    if (url.pathname === '/api/mock-asaas-payment') {
      console.log('Processing request to /api/mock-asaas-payment');
      
      // Convert Node.js request to Fetch API Request for our handler
      const requestInit: RequestInit = {
        method: req.method,
        headers: req.headers as HeadersInit,
      };
      
      if (req.body) {
        requestInit.body = JSON.stringify(req.body);
      }
      
      const request = new Request(`http://${req.headers.host}${req.url}`, requestInit);
      const response = await mockAsaasPaymentHandler(request);
      
      // Set status code
      res.statusCode = response.status;
      
      // Set headers from response
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Write response body
      const body = await response.text();
      res.end(body);
      return;
    }
    
    // Mock payment status check endpoint
    if (url.pathname === '/api/check-payment-status') {
      console.log('Processing request to /api/check-payment-status');
      
      // Convert Node.js request to Fetch API Request
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers as HeadersInit,
      });
      
      const response = await mockCheckPaymentStatusHandler(request);
      
      // Set status code
      res.statusCode = response.status;
      
      // Set headers from response
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Write response body
      const body = await response.text();
      res.end(body);
      return;
    }
  } catch (error) {
    console.error('Error handling API route:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
    return;
  }
  
  // If no API route matched, continue
  next();
};
