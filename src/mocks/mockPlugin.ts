
import { Plugin } from 'vite';
import { apiRoutesMiddleware } from './apiRoutes';

export const mockApiPlugin = (): Plugin => {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
