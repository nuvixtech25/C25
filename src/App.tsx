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

// Importações temporárias para funcionar sem os arquivos reais
const CheckoutPage = () => <div>Checkout Page</div>;
const HomePage = () => <div>Home Page</div>;
const ProductPage = () => <div>Product Page</div>;
const ConfirmationPage = () => <div>Confirmation Page</div>;
const PaymentPendingPage = () => <div>Payment Pending Page</div>;
const TestimonialsPage = () => <div>Testimonials Page</div>;
// const ProductsAdmin = () => <div>Products Admin Page</div>; // Removed as we're now importing the real component
// const OrdersAdmin = () => <div>Orders Admin Page</div>; // Removed as we're now importing the real component
const CheckoutCustomizationPage = () => <div>Checkout Customization Page</div>;

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Existing routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/payment-pending" element={<PaymentPendingPage />} />
            <Route path="/retry-payment" element={<RetryPaymentPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <RequireAuth>
                <Navigate to="/admin/products" replace />
              </RequireAuth>
            } />
            <Route path="/admin/login" element={<Login />} />
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
