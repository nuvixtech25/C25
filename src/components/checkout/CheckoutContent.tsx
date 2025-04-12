
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
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <PersonalInfoSection 
            onSubmit={onCustomerSubmit}
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
          
          <TestimonialSection
            headingColor={customization.headingColor}
          />
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
    </div>
  );
};
