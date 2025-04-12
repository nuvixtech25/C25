
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Checkout from '@/pages/Checkout';
import CheckoutPreview from '@/pages/admin/CheckoutPreview';
import PaymentPage from '@/pages/PaymentPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/preview" element={<CheckoutPreview />} />
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
};

export default PublicRoutes;
