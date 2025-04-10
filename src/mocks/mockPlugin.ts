
import { Plugin } from 'vite';
import { IncomingMessage, ServerResponse } from 'http';
import { apiRoutesMiddleware } from './apiRoutes';

// Extend IncomingMessage type to allow for body property
interface ExtendedIncomingMessage extends IncomingMessage {
  body?: any;
}

// CORS headers to allow access from various domains
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-client-info, apikey',
  'Access-Control-Max-Age': '86400', // 24 hours
};

export const mockApiPlugin = (): Plugin => {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      // Add debug logging
      console.log('Configuring mock API plugin...');
      
      // Handle CORS preflight requests
      server.middlewares.use((req: ExtendedIncomingMessage, res: ServerResponse, next) => {
        console.log(`Request received for: ${req.url}`);
        console.log(`Request headers:`, req.headers);
        
        // Add CORS headers to all responses
        Object.entries(corsHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        
        // Handle OPTIONS requests for CORS preflight
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        
        next();
      });
      
      // Middleware to parse request body
      server.middlewares.use(async (req: ExtendedIncomingMessage, res: ServerResponse, next) => {
        // Parse request body for API routes
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.from(chunk));
            }
            const body = Buffer.concat(chunks).toString('utf8');
            req.body = body ? JSON.parse(body) : {};
          } catch (error) {
            console.error('Error parsing request body:', error);
          }
        }
        
        next();
      });

      // Add our API routes middleware
      server.middlewares.use(apiRoutesMiddleware);
    },
  };
};
