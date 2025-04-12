
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import AdminTools from '@/pages/admin/AdminTools';
import DashboardPage from '@/pages/admin/dashboard';
import PixSettings from '@/pages/admin/PixSettings';
import PixelSettings from '@/pages/admin/PixelSettings';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import WebhookSimulator from '@/pages/admin/WebhookSimulator';
import Login from '@/pages/admin/Login';
import NotFound from '@/pages/NotFound';
import OrdersPage from '@/pages/admin/orders';
import CreditCardsPage from '@/pages/admin/credit-cards';
import ProductsPage from '@/pages/admin/products';
import NewProductPage from '@/pages/admin/products/new';
import EditProductPage from '@/pages/admin/products/edit';
import ApiInformation from '@/pages/admin/ApiInformation';
import PaymentRetryAnalytics from '@/pages/admin/analytics/PaymentRetryAnalytics';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota de login (não protegida) */}
      <Route path="/login" element={<Login />} />
      
      {/* Rota raiz - redireciona para dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Rotas protegidas com AdminLayout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout>
            {/* Nested routes inside the AdminLayout */}
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tools" element={<AdminTools />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<NewProductPage />} />
              <Route path="/products/:id" element={<EditProductPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/credit-cards" element={<CreditCardsPage />} />
              <Route path="/pix-settings" element={<PixSettings />} />
              <Route path="/pixel-settings" element={<PixelSettings />} />
              <Route path="/asaas-settings" element={<AsaasSettings />} />
              <Route path="/webhook-simulator" element={<WebhookSimulator />} />
              <Route path="/api-information" element={<ApiInformation />} />
              <Route path="/analytics/payment-retry" element={<PaymentRetryAnalytics />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Rota de fallback para páginas administrativas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
