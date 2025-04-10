
import { RequestHandler } from 'express';
import { handler as webhookSimulatorHandler } from '../pages/api/webhook-simulator';

// This is a mapping of API routes to their handlers
export const apiRoutes: Record<string, (req: Request) => Promise<Response>> = {
  '/api/webhook-simulator': webhookSimulatorHandler,
};

// Middleware for Express to handle API routes
export const apiRoutesMiddleware: RequestHandler = async (req, res, next) => {
  const path = req.originalUrl;
  
  // Check if we have a handler for this route
  if (path in apiRoutes) {
    console.log(`Handling API route: ${path}`);
    
    try {
      // Convert Express request to a fetch API Request
      const request = new Request(new URL(path, 'http://localhost'), {
        method: req.method,
        headers: req.headers as any,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      });
      
      // Call the handler with our Request object
      const response = await apiRoutes[path](request);
      
      // Send the response status
      res.status(response.status);
      
      // Set the response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send the response body
      const body = await response.text();
      res.send(body);
    } catch (error) {
      console.error(`Error handling API route ${path}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Not an API route we handle, continue with normal request processing
    next();
  }
};
