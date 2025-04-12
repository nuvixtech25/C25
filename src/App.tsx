
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { usePixelEvents } from './hooks/usePixelEvents';
import AppRoutes from './routes/AppRoutes';

// Create a client
const queryClient = new QueryClient();

// Root App component to initialize pixels
const AppWithPixels = () => {
  // Initialize pixels on app mount
  usePixelEvents({ initialize: true });
  
  return <AppRoutes />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppWithPixels />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
