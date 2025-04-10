
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Checkout from '@/pages/Checkout';
import SuccessPage from '@/pages/SuccessPage';
import NotFound from '@/pages/NotFound';
import PaymentPage from '@/pages/PaymentPage';
import PixSettings from '@/pages/admin/PixSettings';
import ProductsPage from '@/pages/admin/products';
import NewProductPage from '@/pages/admin/products/new';
import EditProductPage from '@/pages/admin/products/edit';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/pix-settings" element={<PixSettings />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/products/new" element={<NewProductPage />} />
        <Route path="/admin/products/edit/:id" element={<EditProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
