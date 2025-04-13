
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';

const ThankYouCardPage = () => {
  const { state } = useLocation();
  const order = state?.order;
  const hasWhatsappSupport = state?.has_whatsapp_support || state?.product?.has_whatsapp_support;
  const whatsappNumber = state?.whatsapp_number || state?.product?.whatsapp_number;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-blue-50">
      <Card className="max-w-md w-full shadow-xl border border-blue-100 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 w-full" />
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-100">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Pagamento Recebido!</h2>
          <p className="text-gray-600 text-lg mt-2">
            Seu pagamento com cartão está sendo processado.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-gray-500 space-y-3">
            <p>Assim que confirmarmos o pagamento, você receberá acesso ao seu produto.</p>
            <p>Fique atento ao seu e-mail!</p>
          </div>
          
          {hasWhatsappSupport && whatsappNumber && (
            <div className="mt-6">
              <WhatsAppButton 
                whatsappNumber={whatsappNumber} 
                message={`Olá! Acabei de fazer um pagamento para o pedido ${order?.id || 'recente'} e gostaria de confirmar o recebimento.`}
                fullWidth={true}
                hasWhatsappSupport={hasWhatsappSupport}
              />
            </div>
          )}
          
          {order && (
            <div className="w-full mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Pedido #{order.id}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYouCardPage;
