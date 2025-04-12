
import React, { useState } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './card/CardForm';
import { SimplifiedPixOption } from './SimplifiedPixOption';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, QrCode } from 'lucide-react';
import { SectionTitle } from '../SectionTitle';

interface PaymentMethodSectionProps {
  id: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data?: any) => void;
  isSubmitting: boolean;
  headingColor: string;
  buttonColor: string;
  buttonText: string;
  productPrice?: number;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  id,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  isSubmitting,
  headingColor,
  buttonColor,
  buttonText,
  productPrice = 0
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);

  const handleSubmit = async (data?: any) => {
    setIsProcessing(true);
    setPaymentError(false);
    setPaymentSuccess(false);
    
    try {
      // Simulate API call
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% success rate for demo
          setPaymentSuccess(true);
          console.log('Payment data:', {
            method: paymentMethod,
            ...data,
            timestamp: new Date().toISOString()
          });
        } else {
          setPaymentError(true);
        }
        setIsProcessing(false);
      }, 2000);
      
      // Actually call the real submission handler
      onSubmit(data);
    } catch (error) {
      setPaymentError(true);
      setIsProcessing(false);
    }
  };

  return (
    <section id={id} className="mb-8">
      <SectionTitle number={3} title="Pagamento" />
      
      <Tabs 
        defaultValue="creditCard" 
        value={paymentMethod}
        onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="creditCard"
            className="flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Cartão de Crédito
          </TabsTrigger>
          <TabsTrigger 
            value="pix"
            className="flex items-center justify-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            PIX
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="creditCard" className="mt-2">
          <CardForm 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting || isProcessing}
            buttonColor="#28A745"
            buttonText="Finalizar Pagamento"
            productPrice={productPrice}
          />
        </TabsContent>
        
        <TabsContent value="pix" className="mt-2">
          <SimplifiedPixOption
            onSubmit={handleSubmit}
            isLoading={isSubmitting || isProcessing}
            buttonColor="#28A745"
            buttonText="Pagar com PIX"
            showQrCode={paymentSuccess}
          />
        </TabsContent>
      </Tabs>
      
      {paymentSuccess && paymentMethod === 'creditCard' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          Pagamento realizado com sucesso! Verifique seu e-mail.
        </div>
      )}
      
      {paymentError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
          Erro no pagamento. Verifique os dados.
        </div>
      )}
    </section>
  );
};
