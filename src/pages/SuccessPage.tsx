
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Lock, ExternalLink, X } from 'lucide-react';
import { usePixelEvents } from '@/hooks/usePixelEvents';

const SuccessPage = () => {
  const location = useLocation();
  const { trackPurchase } = usePixelEvents();
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  
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
      
      // Check if the product is digital based on various possible properties
      if (
        location.state.productType === 'digital' || 
        order.productType === 'digital' ||
        order.isDigital === true
      ) {
        console.log('Setting digital product to true');
        setIsDigitalProduct(true);
      }
    }
  }, [location.state, trackPurchase]);

  const handleCloseWindow = () => {
    window.close();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full shadow-md border border-gray-100 rounded-lg overflow-hidden">
        <CardHeader className="text-center bg-white pb-6 relative">
          <button 
            onClick={handleCloseWindow}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar página"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-800">Pagamento Confirmado</CardTitle>
          <CardDescription className="text-gray-600">
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-6">
          <p className="text-gray-700">Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 my-4 flex items-start">
            <div className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
              <ShoppingBag className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-800 font-medium">Um e-mail com os detalhes da compra foi enviado para você.</p>
              <p className="text-gray-600 text-sm mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
            </div>
          </div>
          
          {isDigitalProduct && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 my-4 flex items-start">
              <div className="bg-gray-100 p-2 rounded-full mr-3 mt-1">
                <Lock className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-medium">Seus dados de acesso estão prontos!</p>
                <p className="text-gray-600 text-sm mt-1">Clique no botão abaixo para ver seus dados de acesso ao produto digital.</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col pb-6 gap-3">
          {isDigitalProduct ? (
            <Button 
              asChild 
              className="w-full bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 h-auto text-white border-0"
            >
              <Link to="/access-data" className="flex items-center justify-center">
                Ver dados de acesso
                <Lock className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          
          <Button 
            onClick={handleCloseWindow}
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 px-6 py-2 h-auto transition-colors"
          >
            Fechar página
            <X className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
