
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RetryPaymentPage from './pages/RetryPaymentPage';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './contexts/auth/RequireAuth'; // Usamos default import
import AdminLayout from './layouts/AdminLayout';
import CreditCardsPage from './pages/admin/credit-cards';
import PaymentRetryAnalytics from "./pages/admin/analytics/PaymentRetryAnalytics";
import ProductsPage from './pages/admin/products';
import EditProductPage from './pages/admin/products/edit';
import NewProductPage from './pages/admin/products/new';

// Importações temporárias para funcionar sem os arquivos reais
const CheckoutPage = () => <div>Checkout Page</div>;
const HomePage = () => <div>Home Page</div>;
const ProductPage = () => <div>Product Page</div>;
const ConfirmationPage = () => <div>Confirmation Page</div>;
const PaymentPendingPage = () => <div>Payment Pending Page</div>;
const TestimonialsPage = () => <div>Testimonials Page</div>;
const AdminPage = () => <div>Admin Page</div>;
const OrdersAdmin = () => <div>Orders Admin Page</div>;
const LoginPage = () => <div>Login Page</div>;
const CheckoutCustomizationPage = () => <div>Checkout Customization Page</div>;
const PixSettingsPage = () => <div>Configurações do PIX</div>;
const AsaasSettingsPage = () => <div>Configurações do Asaas</div>;
const WebhookSimulatorPage = () => <div>Simulador de Webhook</div>;
const AdminToolsPage = () => <div>Ferramentas de Admin</div>;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/payment-pending" element={<PaymentPendingPage />} />
            <Route path="/retry-payment" element={<RetryPaymentPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <RequireAuth>
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              </RequireAuth>
            } />
            <Route path="/admin/products" element={
              <RequireAuth>
                <AdminLayout>
                  <ProductsPage />
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
                  <OrdersAdmin />
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
            {/* Adicionar as rotas que estão faltando */}
            <Route path="/admin/pix-settings" element={
              <RequireAuth>
                <AdminLayout>
                  <PixSettingsPage />
                </AdminLayout>
              </RequireAuth>
            } />
            <Route path="/admin/asaas-settings" element={
              <RequireAuth>
                <AdminLayout>
                  <AsaasSettingsPage />
                </AdminLayout>
              </RequireAuth>
            } />
            <Route path="/admin/webhook-simulator" element={
              <RequireAuth>
                <AdminLayout>
                  <WebhookSimulatorPage />
                </AdminLayout>
              </RequireAuth>
            } />
            <Route path="/admin/tools" element={
              <RequireAuth>
                <AdminLayout>
                  <AdminToolsPage />
                </AdminLayout>
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
