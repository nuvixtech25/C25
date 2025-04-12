
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import RequireAuth from '../contexts/auth/RequireAuth';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/dashboard';
import ProductsAdmin from '../pages/admin/products';
import NewProductPage from '../pages/admin/products/new';
import EditProductPage from '../pages/admin/products/edit';
import OrdersPage from '../pages/admin/orders';
import CreditCardsPage from '../pages/admin/credit-cards';
import PixSettings from '../pages/admin/PixSettings';
import PixelSettings from '../pages/admin/PixelSettings';
import AsaasSettings from '../pages/admin/AsaasSettings';
import WebhookSimulator from '../pages/admin/WebhookSimulator';
import ApiInformation from '../pages/admin/ApiInformation';
import AdminTools from '../pages/admin/AdminTools';
import AdminLogin from '../pages/admin/Login';
import PaymentRetryAnalytics from "../pages/admin/analytics/PaymentRetryAnalytics";

// Importação temporária para funcionar sem os arquivos reais
const CheckoutCustomizationPage = () => <div>Checkout Customization Page</div>;

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={
        <RequireAuth>
          <Navigate to="/admin/dashboard" replace />
        </RequireAuth>
      } />
      <Route path="/admin/login" element={<AdminLogin />} />
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
    </>
  );
};

export default AdminRoutes;
