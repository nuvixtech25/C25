import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import BusinessRegistration from '../pages/BusinessRegistration';
import Checkout from '../pages/Checkout';
import CheckoutPreview from '../pages/admin/CheckoutPreview';
import SuccessPage from '../pages/SuccessPage';
import FailedPage from '../pages/FailedPage';
import PaymentPage from '../pages/PaymentPage';
import PaymentPendingPage from '../pages/PaymentPendingPage';
import RetryPaymentPage from '../pages/RetryPaymentPage';
import Login from '../pages/Login';
import AccessDataPage from '../pages/AccessDataPage';
import AccessProductPage from '../pages/AccessProductPage';
import NotFound from '../pages/NotFound';

// Importações temporárias para funcionar sem os arquivos reais
const ProductPage = () => <div>Product Page</div>;
const ConfirmationPage = () => <div>Confirmation Page</div>;
const TestimonialsPage = () => <div>Testimonials Page</div>;

const PublicRoutes = () => {
  return (
    <>
      {/* Landing Page as the default route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Business Registration form replaces the produto-exemplo route */}
      <Route path="/checkout/produto-exemplo" element={<BusinessRegistration />} />
      
      {/* Existing routes */}
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/checkout/:slug" element={<Checkout />} />
      <Route path="/checkout/preview" element={<CheckoutPreview />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/payment-pending" element={<PaymentPendingPage />} />
      <Route path="/retry-payment" element={<RetryPaymentPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/payment-failed" element={<FailedPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      
      {/* Adicionar redirecionamento de /payment-success para /success */}
      <Route path="/payment-success" element={<Navigate to="/success" replace />} />
      
      {/* New routes for digital product access */}
      <Route path="/access-data" element={<AccessDataPage />} />
      <Route path="/access-product" element={<AccessProductPage />} />
      
      {/* Fallback route for 404 */}
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default PublicRoutes;
