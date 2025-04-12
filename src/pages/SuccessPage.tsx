
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
      
      // Explicitly convert values to boolean to handle string values like "true"/"false"
      const locationStateWhatsApp = String(location.state.has_whatsapp_support).toLowerCase() === 'true';
      const orderWhatsApp = String(order.has_whatsapp_support).toLowerCase() === 'true';
      const productWhatsApp = product && String(product.has_whatsapp_support).toLowerCase() === 'true';
      
      console.log('[SuccessPage] WhatsApp support raw values:', {
        locationStateWhatsAppRaw: location.state.has_whatsapp_support,
        orderWhatsAppRaw: order.has_whatsapp_support,
        productWhatsAppRaw: product?.has_whatsapp_support
      });
      
      console.log('[SuccessPage] WhatsApp support boolean values:', {
        locationStateWhatsApp,
        orderWhatsApp,
        productWhatsApp
      });

      // Set WhatsApp support flag if any source indicates it's enabled
      const whatsappEnabled = locationStateWhatsApp || orderWhatsApp || productWhatsApp;
      
      console.log('[SuccessPage] Final WhatsApp support decision:', whatsappEnabled);
      setHasWhatsappSupport(whatsappEnabled);
      
      if (whatsappEnabled) {
        // Get WhatsApp number from any available source
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
      }
    } else {
      // For testing purposes, we'll set some mock data when there's no state
      // REMOVE THIS IN PRODUCTION
      console.log('[SuccessPage] No order data found - setting test data for WhatsApp');
      setHasWhatsappSupport(true);
      setWhatsappNumber('5511999999999');
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

  // Log WhatsApp button props before rendering
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
          
          {/* Always render the WhatsApp button and let its internal logic determine visibility */}
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
          />
          
          {/* Debug info for development - REMOVE IN PRODUCTION */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-3 text-xs bg-gray-100 p-2 rounded text-gray-500">
              Debug: WhatsApp Support: {hasWhatsappSupport ? 'Yes' : 'No'}, 
              Number: {whatsappNumber || 'None'}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
