
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, XCircle, CreditCard } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-red-50">
      <Card className="max-w-md w-full shadow-xl border border-red-100 rounded-xl overflow-hidden">
        <div className="bg-red-500 h-2 w-full" />
        <CardHeader className="text-center pt-8">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Pagamento não aprovado</CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            Houve um problema com seu pagamento
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-6">
          <p className="text-gray-700">Seu pagamento não foi autorizado pela operadora do cartão. Isso pode ocorrer por diversos motivos:</p>
          
          <div className="bg-red-50 rounded-lg border border-red-100 p-4 my-4">
            <div className="flex flex-col space-y-3 text-left">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Cartão com limite insuficiente</strong> - Verifique se há saldo disponível</p>
              </div>
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Dados incorretos</strong> - Confira se todos os dados foram digitados corretamente</p>
              </div>
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700"><strong>Cartão bloqueado</strong> - Entre em contato com seu banco</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 my-4 animate-pulse-slow">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
              <p className="text-amber-700 font-medium">Não tente novamente com o mesmo cartão! O problema persistirá.</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pb-8">
          {order && order.paymentMethod === 'creditCard' && (
            <Button 
              onClick={handleRetry} 
              className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-300 py-6 h-auto text-base font-medium"
            >
              <RefreshCcw className="h-5 w-5" />
              Tentar com outro cartão
            </Button>
          )}
          
          {/* Always show WhatsApp button with forceShow prop */}
          <WhatsAppButton 
            hasWhatsappSupport={hasWhatsappSupport} 
            whatsappNumber={whatsappNumber}
            forceShow={true}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailedPage;
