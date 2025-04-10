
import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';

// Public pages
import Checkout from '@/pages/Checkout';
import SuccessPage from '@/pages/SuccessPage';
import NotFound from '@/pages/NotFound';
import PaymentPage from '@/pages/PaymentPage';

// Admin pages
import Login from '@/pages/admin/Login';
import PixSettings from '@/pages/admin/PixSettings';
import ProductsPage from '@/pages/admin/products';
import NewProductPage from '@/pages/admin/products/new';
import EditProductPage from '@/pages/admin/products/edit';
import AdminTools from '@/pages/admin/AdminTools';

import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

// Create router with protected routes
const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Navigate to="/checkout/curso-de-marketing-digital" replace />,
  },
  {
    path: "/checkout/:slug",
    element: <Checkout />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
  
  // Admin routes
  {
    path: "/admin",
    element: <Navigate to="/admin/products" replace />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ProductsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/new",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <NewProductPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products/edit/:id",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <EditProductPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/pix-settings",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <PixSettings />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/tools",
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AdminTools />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  
  // 404 route
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
