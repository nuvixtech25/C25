
import React from 'react';
import { CheckoutCustomization, CustomerData, PaymentMethod, Product } from '@/types/checkout';
import { PersonalInfoSection } from './PersonalInfoSection';
import { TestimonialSection } from './TestimonialSection';
import { PaymentMethodSection } from './payment-methods/PaymentMethodSection';
import { OrderSummary } from './OrderSummary';

interface CheckoutContentProps {
  product: Product;
  customerData: CustomerData | null;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  customization: CheckoutCustomization;
  onCustomerSubmit: (customerData: CustomerData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: (data?: any) => void;
}

export const CheckoutContent: React.FC<CheckoutContentProps> = ({
  product,
  customerData,
  paymentMethod,
  isSubmitting,
  customization,
  onCustomerSubmit,
  onPaymentMethodChange,
  onPaymentSubmit
}) => {
  return (
    <div className="space-y-4">
      <PersonalInfoSection 
        onSubmit={onCustomerSubmit}
        headingColor={customization.headingColor}
      />
      
      {customerData && (
        <>
          <TestimonialSection
            headingColor={customization.headingColor}
          />
          
          <PaymentMethodSection
            id="payment-section"
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
            onSubmit={onPaymentSubmit}
            isSubmitting={isSubmitting}
            headingColor={customization.headingColor}
            buttonColor={customization.buttonColor}
            buttonText={customization.buttonText}
            productPrice={product.price}
          />
          
          <OrderSummary 
            product={product}
            isDigitalProduct={customization.isDigitalProduct}
          />
        </>
      )}
    </div>
  );
};
