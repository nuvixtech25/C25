
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersPage from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import AsaasEmailSettings from '@/pages/admin/AsaasEmailSettings';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/pages/admin/dashboard';
import Login from '@/pages/admin/Login';
import AdminLayout from '@/layouts/AdminLayout';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/orders" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <OrdersPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/products" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/asaas" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AsaasSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/asaas-email" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <AsaasEmailSettings />
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;
