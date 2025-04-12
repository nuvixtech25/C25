
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
    console.log('[SuccessPage] Initializing with location state:', JSON.stringify(location.state, null, 2));
    
    if (location.state?.order) {
      const { order, product } = location.state;
      
      console.log('[SuccessPage] Processing order details:', JSON.stringify(order, null, 2));
      console.log('[SuccessPage] Product info from state:', JSON.stringify(product, null, 2));
      
      // Track purchase event
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
        console.log('[SuccessPage] Digital product detected');
        setIsDigitalProduct(true);
      }
      
      // Enhanced WhatsApp support detection logic
      const locationStateWhatsApp = location.state.has_whatsapp_support === true;
      const orderWhatsApp = order.has_whatsapp_support === true;
      const productWhatsApp = product?.has_whatsapp_support === true;
      
      console.log('[SuccessPage] WhatsApp support details:', {
        locationStateWhatsApp,
        orderWhatsApp,
        productWhatsApp,
        locationWhatsAppType: typeof location.state.has_whatsapp_support,
        orderWhatsAppType: typeof order.has_whatsapp_support,
        productWhatsAppType: typeof product?.has_whatsapp_support
      });

      // Use Boolean to handle falsy values properly
      const checkWhatsAppSupport = Boolean(locationStateWhatsApp || orderWhatsApp || productWhatsApp);

      if (checkWhatsAppSupport) {
        console.log('[SuccessPage] WhatsApp support is enabled');
        setHasWhatsappSupport(true);
        
        const locationNumber = location.state.whatsapp_number;
        const orderNumber = order.whatsapp_number;
        const productNumber = product?.whatsapp_number;
          
        console.log('[SuccessPage] WhatsApp number sources:', {
          locationNumber,
          orderNumber,
          productNumber
        });
        
        const wNumber = locationNumber || orderNumber || productNumber;
          
        if (wNumber) {
          console.log('[SuccessPage] Setting WhatsApp number:', wNumber);
          setWhatsappNumber(wNumber);
        } else {
          console.log('[SuccessPage] Warning: WhatsApp support enabled but no number found');
        }
      } else {
        console.log('[SuccessPage] WhatsApp support is disabled or not configured');
      }
    } else {
      console.log('[SuccessPage] No order data found in location state');
    }
  }, [location.state, trackPurchase]);

  // Add debug rendering information
  useEffect(() => {
    console.log('[SuccessPage] Current component state:', {
      isDigitalProduct,
      hasWhatsappSupport,
      whatsappNumber,
      whatsappNumberLength: whatsappNumber?.length
    });
  }, [isDigitalProduct, hasWhatsappSupport, whatsappNumber]);

  // Log WhatsApp button props before rendering (outside JSX)
  useEffect(() => {
    console.log('[SuccessPage] Rendering WhatsApp button with props:', { 
      hasWhatsappSupport, 
      whatsappNumber 
    });
  }, [hasWhatsappSupport, whatsappNumber]);

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
          
          {/* WhatsApp button component with props */}
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
