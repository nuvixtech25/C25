import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabaseClientService } from '@/services/supabaseClientService';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';
import { EmailConfirmationSection } from './SuccessPage/EmailConfirmationSection';
import { DigitalProductSection, DigitalProductButton } from './SuccessPage/DigitalProductSection';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
const SuccessPage = () => {
  const location = useLocation();
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);

  const fetchWhatsAppInfo = useCallback(async () => {
    if (!location.state?.order) return;

    const { order } = location.state;
    
    try {
      const productInfo = await supabaseClientService.getProductWhatsAppInfo(order.productId);
      
      const finalWhatsappSupport = 
        productInfo.hasWhatsappSupport || 
        location.state.has_whatsapp_support || 
        order.has_whatsapp_support || 
        false;

      const finalWhatsappNumber = 
        productInfo.whatsappNumber || 
        location.state.whatsapp_number || 
        order.whatsapp_number || 
        '';

      console.log('[SuccessPage] Final WhatsApp Details:', {
        hasWhatsappSupport: finalWhatsappSupport,
        whatsappNumber: finalWhatsappNumber
      });

      setHasWhatsappSupport(finalWhatsappSupport);
      setWhatsappNumber(finalWhatsappNumber);

      // Persist to localStorage for potential page reloads
      if (finalWhatsappSupport || finalWhatsappNumber) {
        localStorage.setItem('whatsapp_support', finalWhatsappSupport.toString());
        localStorage.setItem('whatsapp_number', finalWhatsappNumber);
      }
    } catch (error) {
      console.error('[SuccessPage] Error fetching WhatsApp info:', error);
    }
  }, [location.state]);

  useEffect(() => {
    fetchWhatsAppInfo();
  }, [fetchWhatsAppInfo]);

  // Fallback to localStorage if state is lost
  useEffect(() => {
    const storedWhatsappSupport = localStorage.getItem('whatsapp_support');
    const storedWhatsappNumber = localStorage.getItem('whatsapp_number');

    if (storedWhatsappSupport && storedWhatsappNumber) {
      setHasWhatsappSupport(storedWhatsappSupport === 'true');
      setWhatsappNumber(storedWhatsappNumber);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="max-w-md w-full shadow-lg border border-gray-100 rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-white pb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-5 px-6 py-6 bg-white">
          <p className="text-gray-700 text-lg">Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          
          <EmailConfirmationSection />
          
          <DigitalProductSection isDigital={isDigitalProduct} />
          
          <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4 text-lg">O que nossos clientes estão dizendo:</h3>
            <TestimonialsCarousel />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col pb-6 gap-3 pt-4 bg-white">
          <DigitalProductButton isDigital={isDigitalProduct} />
          
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
            message={`Olá! Acabei de fazer um pagamento para o pedido ${location.state?.order?.id || 'recente'} e gostaria de confirmar o recebimento.`}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
