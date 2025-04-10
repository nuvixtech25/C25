
import { IncomingMessage, ServerResponse } from 'http';
import { handler as webhookSimulatorHandler } from '../pages/api/webhook-simulator';

// This is a mapping of API routes to their handlers
export const apiRoutes: Record<string, (req: Request) => Promise<Response>> = {
  '/api/webhook-simulator': webhookSimulatorHandler,
};

// Custom type for middleware
type NextFunction = () => void;

// Middleware for Vite server to handle API routes
export const apiRoutesMiddleware = async (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: NextFunction
) => {
  const path = req.url || '';
  
  // Check if we have a handler for this route
  if (path in apiRoutes) {
    console.log(`Handling API route: ${path}`);
    
    try {
      // Parse body if it wasn't already parsed
      let body = undefined;
      
      // If req has already parsed body (added by our mockPlugin middleware)
      if ('body' in req && typeof (req as any).body !== 'undefined') {
        body = JSON.stringify((req as any).body);
      }
      
      // Convert node http request to a fetch API Request
      const request = new Request(`http://localhost${path}`, {
        method: req.method || 'GET',
        headers: req.headers as any,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
      });
      
      // Call the handler with our Request object
      const response = await apiRoutes[path](request);
      
      // Send the response status
      res.statusCode = response.status;
      
      // Set the response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send the response body
      const responseBody = await response.text();
      res.end(responseBody);
    } catch (error) {
      console.error(`Error handling API route ${path}:`, error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } else {
    // Not an API route we handle, continue with normal request processing
    next();
  }
};
