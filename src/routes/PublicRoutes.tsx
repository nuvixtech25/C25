
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Checkout from '@/pages/Checkout';
import CheckoutPreview from '@/pages/admin/CheckoutPreview';
import PaymentPage from '@/pages/PaymentPage';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import LandingPage from '@/pages/LandingPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/:slug" element={<Checkout />} />
      <Route path="/checkout/preview" element={<CheckoutPreview />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
