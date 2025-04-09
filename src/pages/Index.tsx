
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '@/components/CheckoutForm';
import { BillingData } from '@/types/checkout';

const Index = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, these would come from your product database or context
  const productValue = 79.90;
  const productDescription = "Curso de Marketing Digital";
  
  const handleSubmit = (data: BillingData) => {
    setIsSubmitting(true);
    
    // Simulate a delay to show loading state
    setTimeout(() => {
      navigate('/payment', { state: { billingData: data } });
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold heading-gradient mb-2">PIX Flow Checkout</h1>
        <p className="text-muted-foreground">
          Complete o formulário abaixo para finalizar sua compra
        </p>
      </div>
      
      <CheckoutForm 
        productValue={productValue}
        productDescription={productDescription}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Pagamento processado de forma segura via Asaas</p>
      </div>
    </div>
  );
};

export default Index;
