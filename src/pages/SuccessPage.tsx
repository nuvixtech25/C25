import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Lock, Mail } from 'lucide-react';
import { usePixelEvents } from '@/hooks/usePixelEvents';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';

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
          
          <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 my-4 flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-gray-800 font-medium text-lg">Um e-mail com os detalhes da compra foi enviado para você.</p>
              <p className="text-gray-600 mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
            </div>
          </div>
          
          {isDigitalProduct && (
            <div className="p-5 bg-purple-50 rounded-lg border border-purple-100 my-4 flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4 mt-1">
                <Lock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-gray-800 font-medium text-lg">Seus dados de acesso estão prontos!</p>
                <p className="text-gray-600 mt-1">Clique no botão abaixo para ver seus dados de acesso ao produto digital.</p>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-4 text-lg">O que nossos clientes estão dizendo:</h3>
            <TestimonialsCarousel />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col pb-6 gap-3 pt-4 bg-white">
          {isDigitalProduct ? (
            <Button 
              asChild 
              className="w-full bg-green-600 hover:bg-green-700 transition-colors px-6 py-3 h-auto text-white border-0 text-lg rounded-lg shadow-md"
            >
              <Link to="/access-data" className="flex items-center justify-center">
                Ver dados de acesso
                <Lock className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
