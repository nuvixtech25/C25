
import React from 'react';
import { CustomerData, CheckoutCustomization, PaymentMethod } from '@/types/checkout';
import { PersonalInfoSection } from '@/components/checkout/PersonalInfoSection';
import { TestimonialSection } from '@/components/checkout/TestimonialSection';
import { PaymentMethodSection } from '@/components/checkout/PaymentMethodSection';

interface CheckoutFormContainerProps {
  customerData: CustomerData | null;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  headingColor?: string;
  buttonColor?: string;
  buttonText?: string;
  onCustomerSubmit: (data: CustomerData) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPaymentSubmit: () => void;
}

export const CheckoutFormContainer: React.FC<CheckoutFormContainerProps> = ({
  customerData,
  paymentMethod,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText,
  onCustomerSubmit,
  onPaymentMethodChange,
  onPaymentSubmit
}) => {
  return (
    <div className="space-y-8">
      <PersonalInfoSection 
        onSubmit={onCustomerSubmit} 
        headingColor={headingColor}
      />
      
      <TestimonialSection headingColor={headingColor} />
      
      {customerData && (
        <PaymentMethodSection
          id="payment-section"
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          onSubmit={onPaymentSubmit}
          isSubmitting={isSubmitting}
          headingColor={headingColor}
          buttonColor={buttonColor}
          buttonText={paymentMethod === 'pix' ? 'Pagar com PIX' : buttonText}
        />
      )}
    </div>
  );
};
