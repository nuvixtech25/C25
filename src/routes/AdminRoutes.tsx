
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTools from '@/pages/admin/AdminTools';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/admin/Login';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import PixSettings from '@/pages/admin/PixSettings';
import PixelSettings from '@/pages/admin/PixelSettings';
import WebhookSimulator from '@/pages/admin/WebhookSimulator';
import Products from '@/pages/admin/products/index';
import NewProduct from '@/pages/admin/products/new';
import EditProduct from '@/pages/admin/products/edit';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/admin/dashboard/index';
import Orders from '@/pages/admin/orders/index';
import CreditCards from '@/pages/admin/credit-cards/index';
import ApiInformation from '@/pages/admin/ApiInformation';
import PaymentRetryAnalytics from '@/pages/admin/analytics/PaymentRetryAnalytics';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Admin Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <AdminLayout>
            <Orders />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/products" element={
        <ProtectedRoute>
          <AdminLayout>
            <Products />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/products/new" element={
        <ProtectedRoute>
          <AdminLayout>
            <NewProduct />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/products/:id/edit" element={
        <ProtectedRoute>
          <AdminLayout>
            <EditProduct />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/credit-cards" element={
        <ProtectedRoute>
          <AdminLayout>
            <CreditCards />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pix-settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <PixSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pixel-settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <PixelSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/asaas-settings" element={
        <ProtectedRoute>
          <AdminLayout>
            <AsaasSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/webhook-simulator" element={
        <ProtectedRoute>
          <AdminLayout>
            <WebhookSimulator />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tools" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminTools />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/api-information" element={
        <ProtectedRoute>
          <AdminLayout>
            <ApiInformation />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics/payment-retry" element={
        <ProtectedRoute>
          <AdminLayout>
            <PaymentRetryAnalytics />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch-all for undefined admin routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
