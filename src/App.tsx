
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Checkout from '@/pages/Checkout';
import SuccessPage from '@/pages/SuccessPage';
import NotFound from '@/pages/NotFound';
import PaymentPage from '@/pages/PaymentPage';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
