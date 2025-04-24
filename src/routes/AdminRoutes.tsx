
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersPage from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import AsaasEmailSettings from '@/pages/admin/AsaasEmailSettings';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/orders" element={<OrdersPage />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/asaas" element={<AsaasSettings />} />
      <Route path="/admin/asaas-email" element={<AsaasEmailSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
