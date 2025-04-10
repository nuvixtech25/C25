
import React from 'react';
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
import PixSettings from './pages/admin/PixSettings';
import AsaasSettings from './pages/admin/AsaasSettings';
import WebhookSimulator from './pages/admin/WebhookSimulator';
import ProductsAdmin from './pages/admin/products'; // Import the ProductsAdmin component
import OrdersPage from './pages/admin/orders'; // Import the OrdersPage component
import LandingPage from './pages/LandingPage'; // Import the new LandingPage component
import AdminTools from './pages/admin/AdminTools'; // Import the AdminTools component
import BusinessRegistration from './pages/BusinessRegistration'; // Import the new BusinessRegistration component
import Checkout from './pages/Checkout'; // Import the Checkout component
import Dashboard from './pages/admin/dashboard'; // Import the new Dashboard component

// Importações temporárias para funcionar sem os arquivos reais
const ProductPage = () => <div>Product Page</div>;
const ConfirmationPage = () => <div>Confirmation Page</div>;
const PaymentPendingPage = () => <div>Payment Pending Page</div>;
const TestimonialsPage = () => <div>Testimonials Page</div>;
const CheckoutCustomizationPage = () => <div>Checkout Customization Page</div>;

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
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
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <RequireAuth>
                <Navigate to="/admin/dashboard" replace />
              </RequireAuth>
            } />
            <Route path="/admin/login" element={<Login />} />
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
