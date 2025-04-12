
import React from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './card/CardForm';
import { SimplifiedPixOption } from './SimplifiedPixOption';

interface PaymentMethodFormsProps {
  paymentMethod: PaymentMethod;
  onSubmit: (data?: any) => void;
  isLoading: boolean;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
  showQrCode?: boolean;
}

export const PaymentMethodForms: React.FC<PaymentMethodFormsProps> = ({
  paymentMethod,
  onSubmit,
  isLoading,
  buttonColor,
  buttonText,
  productPrice = 0,
  showQrCode = false
}) => {
  if (paymentMethod === 'creditCard') {
    return (
      <CardForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonColor={buttonColor}
        buttonText={buttonText}
        productPrice={productPrice}
      />
    );
  }
  
  if (paymentMethod === 'pix') {
    return (
      <SimplifiedPixOption
        onSubmit={() => onSubmit()}
        isLoading={isLoading}
        buttonColor={buttonColor}
        buttonText="Pagar com PIX"
        showQrCode={showQrCode}
      />
    );
  }
  
  return null;
};
