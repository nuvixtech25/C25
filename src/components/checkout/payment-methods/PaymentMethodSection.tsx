
import React, { useState } from 'react';
import { PaymentMethod } from '@/types/checkout';
import { CardForm } from './card/CardForm';
import { SimplifiedPixOption } from './SimplifiedPixOption';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, QrCode } from 'lucide-react';
import { SectionTitle } from '../SectionTitle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

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

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value
    });
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(cardData);
  };

  return (
    <section id={id} className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <SectionTitle number={3} title="Pagamento" />
        
        <div className="mt-4">
          <RadioGroup 
            defaultValue={paymentMethod}
            value={paymentMethod}
            onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <label 
              className={`flex items-center border rounded-md p-3 cursor-pointer transition-colors ${
                paymentMethod === 'creditCard' ? 'border-[#28A745] bg-gray-50' : 'border-gray-200'
              }`}
            >
              <RadioGroupItem value="creditCard" id="creditCard" className="mr-3" />
              <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium text-sm">Cartão de Crédito</span>
            </label>
            
            <label 
              className={`flex items-center border rounded-md p-3 cursor-pointer transition-colors ${
                paymentMethod === 'pix' ? 'border-[#28A745] bg-gray-50' : 'border-gray-200'
              }`}
            >
              <RadioGroupItem value="pix" id="pix" className="mr-3" />
              <QrCode className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium text-sm">PIX</span>
            </label>
          </RadioGroup>
          
          {paymentMethod === 'creditCard' && (
            <form onSubmit={handleCardSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="holderName" className="block text-sm font-medium mb-1">Nome no cartão</label>
                  <Input
                    id="holderName"
                    name="holderName"
                    placeholder="Nome como aparece no cartão"
                    value={cardData.holderName}
                    onChange={handleCardChange}
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="number" className="block text-sm font-medium mb-1">Número do cartão</label>
                  <Input
                    id="number"
                    name="number"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={handleCardChange}
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="expiryMonth" className="block text-sm font-medium mb-1">Mês</label>
                    <Input
                      id="expiryMonth"
                      name="expiryMonth"
                      placeholder="MM"
                      value={cardData.expiryMonth}
                      onChange={handleCardChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expiryYear" className="block text-sm font-medium mb-1">Ano</label>
                    <Input
                      id="expiryYear"
                      name="expiryYear"
                      placeholder="AA"
                      value={cardData.expiryYear}
                      onChange={handleCardChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center"
                  style={{ backgroundColor: "#28A745" }}
                  disabled={isProcessing}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Processando...' : 'Finalizar Pagamento'}
                </Button>
              </div>
            </form>
          )}
          
          {paymentMethod === 'pix' && (
            <SimplifiedPixOption
              onSubmit={handleSubmit}
              isLoading={isSubmitting || isProcessing}
              buttonColor="#28A745"
              buttonText="Pagar com PIX"
              showQrCode={paymentSuccess}
            />
          )}
          
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
        </div>
      </div>
    </section>
  );
};
