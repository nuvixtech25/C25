
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { EmailConfirmationSection } from './SuccessPage/EmailConfirmationSection';
import { DigitalProductSection, DigitalProductButton } from './SuccessPage/DigitalProductSection';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';

const SuccessPage = () => {
  const location = useLocation();
  const { trackPurchase } = usePixelEvents();
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  useEffect(() => {
    // Debugging log to show all state details
    console.log('Location state details:', JSON.stringify(location.state, null, 2));
    
    // Track purchase event if we have order data from location state
    if (location.state?.order) {
      const { order } = location.state;
      console.log('Order details:', JSON.stringify(order, null, 2));
      
      trackPurchase(
        order.id || 'unknown-order',
        order.productPrice || 0
      );
      
      // Check if the product is digital
      if (
        location.state.productType === 'digital' || 
        order.productType === 'digital' ||
        order.isDigital === true
      ) {
        console.log('Setting digital product to true');
        setIsDigitalProduct(true);
      }
      
      // Check if the product has WhatsApp support
      if (
        location.state.has_whatsapp_support === true ||
        order.has_whatsapp_support === true ||
        location.state.product?.has_whatsapp_support === true
      ) {
        console.log('Setting WhatsApp support to true');
        setHasWhatsappSupport(true);
        
        const wNumber = 
          location.state.whatsapp_number || 
          order.whatsapp_number || 
          location.state.product?.whatsapp_number;
          
        if (wNumber) {
          setWhatsappNumber(wNumber);
        }
      }
    }
  }, [location.state, trackPurchase]);

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
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
