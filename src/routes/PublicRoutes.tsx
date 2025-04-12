
import React from 'react';
import { Route } from 'react-router-dom';
import Index from '@/pages/Index';
import CheckoutPreview from '@/pages/admin/CheckoutPreview';
import PaymentPage from '@/pages/PaymentPage';

const PublicRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/checkout/preview" element={<CheckoutPreview />} />
      <Route path="/payment" element={<PaymentPage />} />
    </>
  );
};

export default PublicRoutes;
