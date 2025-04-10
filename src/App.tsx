import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import RetryPaymentPage from './pages/RetryPaymentPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AdminPage from './pages/AdminPage';
import ProductsAdmin from './pages/admin/products';
import OrdersAdmin from './pages/admin/orders';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import AdminLayout from './components/AdminLayout';
import CreditCardsPage from './pages/admin/credit-cards';
import CheckoutCustomizationPage from './pages/admin/checkout';
import PaymentRetryAnalytics from "./pages/admin/analytics/PaymentRetryAnalytics";

function App() {
  return (
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
                <ProductsAdmin />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
