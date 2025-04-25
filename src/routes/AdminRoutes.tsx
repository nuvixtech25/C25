
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import OrdersPage from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import AsaasEmailSettings from '@/pages/admin/AsaasEmailSettings';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/pages/admin/dashboard';
import Login from '@/pages/admin/Login';
import AdminLayout from '@/layouts/AdminLayout';
import PixSettings from '@/pages/admin/PixSettings';
import PixelSettings from '@/pages/admin/PixelSettings';
import CreditCardsList from '@/pages/admin/credit-cards';

const AdminRoutes = () => {
  useEffect(() => {
    console.log('AdminRoutes mounted, checking auth state...');
  }, []);
  
  return (
    <Routes>
      {/* Public admin routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Dashboard - Accessible to all authenticated users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin-only routes */}
      <Route path="/orders" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/products" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/asaas" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AsaasSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/asaas-email" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AsaasEmailSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Adicionando a rota de cartões de crédito */}
      <Route path="/credit-cards" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <CreditCardsList />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Adicionando as rotas de configurações PIX */}
      <Route path="/pix-settings" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <PixSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Adicionando as rotas de configurações de Pixel */}
      <Route path="/pixel-settings" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <PixelSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;
