
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/checkout';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';

const FailedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { trackPurchase } = usePixelEvents();

  useEffect(() => {
    console.log('[FailedPage] Full location state:', JSON.stringify(state, null, 2));
    
    // Get order from location state if available
    if (state?.order) {
      setOrder(state.order);
      
      // We can still track failed purchases for remarketing
      if (state.order.id && state.order.productPrice) {
        trackPurchase(state.order.id, 0); // Value 0 for failed payment
      }
      
      // Process WhatsApp data if available in state
      const product = state.product || {};
      
      console.log('[FailedPage] Product data:', {
        hasWhatsappSupport: product?.has_whatsapp_support,
        whatsappNumber: product?.whatsapp_number
      });
      
      // Check if WhatsApp support is enabled
      const productHasWhatsappSupport = Boolean(
        product?.has_whatsapp_support === true || 
        state.has_whatsapp_support === true
      );
      
      console.log('[FailedPage] WhatsApp support status:', productHasWhatsappSupport);
      setHasWhatsappSupport(productHasWhatsappSupport);
      
      // Get WhatsApp number from any available source
      const productNumber = product?.whatsapp_number;
      const locationNumber = state.whatsapp_number;
      
      console.log('[FailedPage] WhatsApp number sources:', {
        productNumber,
        locationNumber
      });
      
      // Use the first available number
      const wNumber = productNumber || locationNumber || '';
      
      console.log('[FailedPage] Setting WhatsApp number:', wNumber);
      setWhatsappNumber(wNumber);
      
      // Store in localStorage as fallback
      if (productHasWhatsappSupport || wNumber) {
        try {
          localStorage.setItem('whatsapp_support', productHasWhatsappSupport.toString());
          if (wNumber) localStorage.setItem('whatsapp_number', wNumber);
          console.log('[FailedPage] Stored WhatsApp data in localStorage for fallback');
        } catch (e) {
          console.error('[FailedPage] Failed to store in localStorage:', e);
        }
      }
    } else {
      // No state available, try to get from localStorage as fallback
      try {
        const storedSupport = localStorage.getItem('whatsapp_support');
        const storedNumber = localStorage.getItem('whatsapp_number');
        
        console.log('[FailedPage] No order data found - checking localStorage:', {
          storedSupport,
          storedNumber
        });
        
        if (storedSupport === 'true') {
          setHasWhatsappSupport(true);
        }
        
        if (storedNumber) {
          setWhatsappNumber(storedNumber);
        }
      } catch (e) {
        console.error('[FailedPage] Failed to read from localStorage:', e);
      }
    }
  }, [state, trackPurchase]);

  // Add debug rendering information
  useEffect(() => {
    console.log('[FailedPage] Current component state:', {
      hasWhatsappSupport,
      whatsappNumber,
      orderExists: !!order
    });
  }, [hasWhatsappSupport, whatsappNumber, order]);

  const handleRetry = () => {
    if (order) {
      navigate(`/retry-payment?orderId=${order.id}`, { state: { order } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-red-500">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Pagamento não aprovado</CardTitle>
          <CardDescription>
            Houve um problema com seu pagamento
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p>Seu pagamento não pôde ser processado. Por favor, tente novamente ou escolha outra forma de pagamento.</p>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100 my-4">
            <p className="text-red-800">Se você já realizou o pagamento e está vendo esta mensagem, entre em contato com nosso suporte.</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {order && order.paymentMethod === 'creditCard' && (
            <Button 
              onClick={handleRetry} 
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar com outro cartão
            </Button>
          )}
          <Button asChild className="w-full bg-asaas-primary hover:bg-asaas-secondary">
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
          
          {/* Add WhatsApp button */}
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
          />
          
          {/* Debug info */}
          <div className="mt-3 text-xs bg-gray-100 p-2 rounded text-gray-500">
            Debug: WhatsApp Support: {hasWhatsappSupport ? 'Yes' : 'No'}, 
            Number: {whatsappNumber || 'None'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailedPage;
