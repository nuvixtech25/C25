import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersPage from '@/pages/admin/orders';
import ProductsPage from '@/pages/admin/products';
import SettingsPage from '@/pages/admin/Settings';
import AsaasSettings from '@/pages/admin/AsaasSettings';
import BusinessRegistrationsPage from '@/pages/admin/BusinessRegistrations';
import TelegramBotsPage from '@/pages/admin/TelegramBotsPage';
import CheckoutCustomizationPage from '@/pages/admin/CheckoutCustomization';
import PixelConfigPage from '@/pages/admin/PixelConfigPage';
import AsaasEmailSettings from '@/pages/admin/AsaasEmailSettings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/orders" element={<OrdersPage />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/asaas" element={<AsaasSettings />} />
      <Route path="/admin/business-registrations" element={<BusinessRegistrationsPage />} />
      <Route path="/admin/telegram-bots" element={<TelegramBotsPage />} />
      <Route path="/admin/checkout-customization" element={<CheckoutCustomizationPage />} />
      <Route path="/admin/pixel-config" element={<PixelConfigPage />} />
      <Route path="/admin/asaas-email" element={<AsaasEmailSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
