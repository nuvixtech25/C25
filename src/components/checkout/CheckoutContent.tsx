
import React from 'react';
import { CheckoutCustomization, CustomerData, PaymentMethod, Product } from '@/types/checkout';
import { PersonalInfoSection } from './PersonalInfoSection';
import { TestimonialSection } from './TestimonialSection';
import { PaymentMethodSection } from './PaymentMethodSection';
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
    <div className="grid md:grid-cols-12 gap-6 mt-6">
      <div className="md:col-span-7 space-y-8">
        <PersonalInfoSection 
          onSubmit={onCustomerSubmit}
          headingColor={customization.headingColor}
        />
        
        <TestimonialSection
          headingColor={customization.headingColor}
        />
        
        {customerData && (
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
        )}
      </div>
      
      <div className="md:col-span-5">
        <div className="sticky top-4">
          <OrderSummary 
            product={product}
            isDigitalProduct={customization.isDigitalProduct}
          />
        </div>
      </div>
    </div>
  );
};
