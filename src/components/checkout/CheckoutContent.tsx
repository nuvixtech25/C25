
import React from 'react';
import { CustomerData, PaymentMethod, Product } from '@/types/checkout';
import { CheckoutFormContainer } from '@/components/checkout/CheckoutFormContainer';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutCustomization } from '@/types/checkout';

interface CheckoutContentProps {
  product: Product;
  customerData: CustomerData | null;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  customization: CheckoutCustomization;
  onCustomerSubmit: (data: CustomerData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: () => void;
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
      <div className="md:col-span-7">
        <CheckoutFormContainer
          customerData={customerData}
          paymentMethod={paymentMethod}
          isSubmitting={isSubmitting}
          headingColor={customization.headingColor}
          buttonColor={customization.buttonColor}
          buttonText={customization.buttonText}
          onCustomerSubmit={onCustomerSubmit}
          onPaymentMethodChange={onPaymentMethodChange}
          onPaymentSubmit={onPaymentSubmit}
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
  );
};
