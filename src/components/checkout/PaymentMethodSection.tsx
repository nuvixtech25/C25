
import React from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './payment-methods/CardForm';
import { SimplifiedPixOption } from './payment-methods/SimplifiedPixOption';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodSectionProps {
  id: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  isSubmitting: boolean;
  headingColor: string;
  buttonColor: string;
  buttonText: string;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  id,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText
}) => {
  return (
    <section id={id} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: headingColor }}>
        Forma de pagamento
      </h2>
      
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: PaymentMethod) => onPaymentMethodChange(value)}
        className="space-y-3 mb-6"
      >
        <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer ${
          paymentMethod === 'creditCard' ? 'border-asaas-primary bg-asaas-light/40' : 'border-gray-200'
        }`}>
          <RadioGroupItem value="creditCard" id="creditCard" />
          <Label htmlFor="creditCard" className="flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Cartão de Crédito
          </Label>
        </div>
        
        <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer ${
          paymentMethod === 'pix' ? 'border-asaas-primary bg-asaas-light/40' : 'border-gray-200'
        }`}>
          <RadioGroupItem value="pix" id="pix" />
          <Label htmlFor="pix" className="flex items-center cursor-pointer">
            <svg className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.2 16.2L19.8 12.6L16.2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.2 12.6H18.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.8 7.8L4.2 4.2L7.8 0.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.8 4.2H5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            PIX
          </Label>
        </div>
      </RadioGroup>
      
      {paymentMethod === 'creditCard' ? (
        <CardForm 
          onSubmit={onSubmit} 
          isLoading={isSubmitting}
          buttonColor={buttonColor}
          buttonText={buttonText}
        />
      ) : (
        <SimplifiedPixOption
          onSubmit={() => onSubmit()}
          isLoading={isSubmitting}
          buttonColor={buttonColor}
        />
      )}
    </section>
  );
};
