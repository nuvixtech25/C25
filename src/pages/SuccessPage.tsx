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
    console.log('[SuccessPage] Full location state:', JSON.stringify(location.state, null, 2));
    
    if (location.state?.order) {
      const { order, product } = location.state;
      
      console.log('[SuccessPage] Product data:', {
        hasWhatsappSupport: product?.has_whatsapp_support,
        whatsappNumber: product?.whatsapp_number,
        orderWhatsappNumber: order.whatsapp_number
      });
      
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
      
      // Get WhatsApp support status
      const productHasWhatsappSupport = product?.has_whatsapp_support === true || 
                                        location.state.has_whatsapp_support === true;
                                        
      console.log('[SuccessPage] WhatsApp support status:', productHasWhatsappSupport);
      setHasWhatsappSupport(productHasWhatsappSupport);
      
      // Get WhatsApp number from any available source with priority
      const productNumber = product?.whatsapp_number;
      const locationNumber = location.state.whatsapp_number;
      const orderNumber = order.whatsapp_number;
        
      console.log('[SuccessPage] WhatsApp number sources:', {
        productNumber,
        locationNumber,
        orderNumber
      });
      
      // Use the first available number with priority order
      const wNumber = productNumber || locationNumber || orderNumber || '';
        
      console.log('[SuccessPage] Setting WhatsApp number:', wNumber);
      setWhatsappNumber(wNumber);
    } else {
      // For testing in development environment only - enable WhatsApp with test number
      console.log('[SuccessPage] No order data found - testing mode');
      if (process.env.NODE_ENV === 'development') {
        setHasWhatsappSupport(true);
        setWhatsappNumber('5511999999999');
      }
    }
  }, [location.state, trackPurchase]);

  // Add debug rendering information
  useEffect(() => {
    console.log('[SuccessPage] Current component state:', {
      isDigitalProduct,
      hasWhatsappSupport,
      whatsappNumber,
      whatsappNumberLength: whatsappNumber?.length || 0
    });
  }, [isDigitalProduct, hasWhatsappSupport, whatsappNumber]);

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
          
          {/* Always render the WhatsApp button with current state */}
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
          />
          
          {/* Debug info - keep this in all environments for troubleshooting */}
          <div className="mt-3 text-xs bg-gray-100 p-2 rounded text-gray-500">
            Debug: WhatsApp Support: {hasWhatsappSupport ? 'Yes' : 'No'}, 
            Number: {whatsappNumber || 'None'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
