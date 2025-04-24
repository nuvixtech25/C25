
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersPage from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import AsaasEmailSettings from '@/pages/admin/AsaasEmailSettings';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/pages/admin/dashboard';
import Login from '@/pages/admin/Login';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/asaas" element={
        <ProtectedRoute>
          <AsaasSettings />
        </ProtectedRoute>
      } />
      <Route path="/admin/asaas-email" element={
        <ProtectedRoute>
          <AsaasEmailSettings />
        </ProtectedRoute>
      } />
      <Route path="/admin/login" element={<Login />} />
    </Routes>
  );
};

export default AdminRoutes;
