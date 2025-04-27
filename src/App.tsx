import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { usePixelEvents } from "./hooks/usePixelEvents";
import AdminRoutes from "./routes/AdminRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { Toaster } from "@/components/ui/toaster";

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      // Remove the onError property as it's not supported in the latest version
    },
  },
});

// Root App component to initialize pixels and logs component tree loading
const AppWithPixels = () => {
  // Initialize pixels on app mount
  usePixelEvents({ initialize: true });

  useEffect(() => {
    console.log("Application initialized");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppWithPixels />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
