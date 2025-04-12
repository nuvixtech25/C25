import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RequireAuth from './contexts/auth/RequireAuth';
import { AuthProvider } from './contexts/AuthContext';
import RetryPaymentPage from './pages/RetryPaymentPage';
import AdminLayout from './layouts/AdminLayout';
import CreditCardsPage from './pages/admin/credit-cards';
import PaymentRetryAnalytics from "./pages/admin/analytics/PaymentRetryAnalytics";
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import AdminLogin from './pages/admin/Login'; // Import the admin-specific Login
import PixSettings from './pages/admin/PixSettings';
import PixelSettings from './pages/admin/PixelSettings';
import AsaasSettings from './pages/admin/AsaasSettings';
import WebhookSimulator from './pages/admin/WebhookSimulator';
import ApiInformation from './pages/admin/ApiInformation'; // Import the new ApiInformation component
import ProductsAdmin from './pages/admin/products'; // Import the ProductsAdmin component
import NewProductPage from './pages/admin/products/new'; // Import the NewProductPage component
import EditProductPage from './pages/admin/products/edit'; // Import the EditProductPage component
import OrdersPage from './pages/admin/orders'; // Import the OrdersPage component
import LandingPage from './pages/LandingPage'; // Import the new LandingPage component
import AdminTools from './pages/admin/AdminTools'; // Import the AdminTools component
import BusinessRegistration from './pages/BusinessRegistration'; // Import the new BusinessRegistration component
import Checkout from './pages/Checkout'; // Import the Checkout component
import Dashboard from './pages/admin/dashboard'; // Import the new Dashboard component
import SuccessPage from './pages/SuccessPage';
import FailedPage from './pages/FailedPage';
import PaymentPage from './pages/PaymentPage';
import { usePixelEvents } from './hooks/usePixelEvents';
import AccessDataPage from './pages/AccessDataPage';
import AccessProductPage from './pages/AccessProductPage';

// Importações temporárias para funcionar sem os arquivos reais
const ProductPage = () => <div>Product Page</div>;
const ConfirmationPage = () => <div>Confirmation Page</div>;
const PaymentPendingPage = () => <div>Payment Pending Page</div>;
const TestimonialsPage = () => <div>Testimonials Page</div>;
const CheckoutCustomizationPage = () => <div>Checkout Customization Page</div>;

// Create a client
const queryClient = new QueryClient();

// Root App component to initialize pixels
const AppWithPixels = () => {
  // Initialize pixels on app mount
  usePixelEvents({ initialize: true });
  
  return (
    <Routes>
      {/* Landing Page as the default route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Business Registration form replaces the produto-exemplo route */}
      <Route path="/checkout/produto-exemplo" element={<BusinessRegistration />} />
      
      {/* Existing routes */}
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/checkout/:slug" element={<Checkout />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/payment-pending" element={<PaymentPendingPage />} />
      <Route path="/retry-payment" element={<RetryPaymentPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/payment-failed" element={<FailedPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      
      {/* Adicionar redirecionamento de /payment-success para /success */}
      <Route path="/payment-success" element={<Navigate to="/success" replace />} />
      
      {/* New routes for digital product access */}
      <Route path="/access-data" element={<AccessDataPage />} />
      <Route path="/access-product" element={<AccessProductPage />} />
      
      {/* Admin Routes - Protected */}
      <Route path="/admin" element={
        <RequireAuth>
          <Navigate to="/admin/dashboard" replace />
        </RequireAuth>
      } />
      <Route path="/admin/login" element={<AdminLogin />} /> {/* Use admin-specific login component */}
      <Route path="/admin/dashboard" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
      <Route path="/admin/products" element={
        <RequireAuth>
          <AdminLayout>
            <ProductsAdmin />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/products/new" element={
        <RequireAuth>
          <AdminLayout>
            <NewProductPage />
          </AdminLayout>
        </RequireAuth>
      } />
      {/* Add the edit product route */}
      <Route path="/admin/products/edit/:id" element={
        <RequireAuth>
          <AdminLayout>
            <EditProductPage />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/orders" element={
        <RequireAuth>
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/credit-cards" element={
        <RequireAuth>
          <AdminLayout>
            <CreditCardsPage />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/pix-settings" element={
        <RequireAuth>
          <AdminLayout>
            <PixSettings />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/pixel-settings" element={
        <RequireAuth>
          <AdminLayout>
            <PixelSettings />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/asaas-settings" element={
        <RequireAuth>
          <AdminLayout>
            <AsaasSettings />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/webhook-simulator" element={
        <RequireAuth>
          <AdminLayout>
            <WebhookSimulator />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/api-information" element={
        <RequireAuth>
          <AdminLayout>
            <ApiInformation />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/tools" element={
        <RequireAuth>
          <AdminLayout>
            <AdminTools />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/checkout-customization" element={
        <RequireAuth>
          <AdminLayout>
            <CheckoutCustomizationPage />
          </AdminLayout>
        </RequireAuth>
      } />
      <Route path="/admin/analytics/payment-retry" element={
        <RequireAuth>
          <AdminLayout>
            <PaymentRetryAnalytics />
          </AdminLayout>
        </RequireAuth>
      } />

      {/* Fallback route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
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
