
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
        headingColor={headingColor || '#000000'} // Provide default value
      />
      
      <TestimonialSection headingColor={headingColor || '#000000'} /> {/* Provide default value */}
      
      {customerData && (
        <PaymentMethodSection
          id="payment-section"
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          onSubmit={onPaymentSubmit}
          isSubmitting={isSubmitting}
          headingColor={headingColor || '#000000'} // Provide default value
          buttonColor={buttonColor || '#6E59A5'} // Provide default value
          buttonText={paymentMethod === 'pix' ? 'Pagar com PIX' : (buttonText || 'Finalizar Compra')} // Provide default value
        />
      )}
    </div>
  );
};
