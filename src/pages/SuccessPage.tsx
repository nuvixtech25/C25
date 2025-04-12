
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { usePixelEvents } from '@/hooks/usePixelEvents';

const SuccessPage = () => {
  const location = useLocation();
  const { trackPurchase } = usePixelEvents();
  
  useEffect(() => {
    // Track purchase event if we have order data from location state
    if (location.state?.order) {
      const { order } = location.state;
      trackPurchase(
        order.id || 'unknown-order',
        order.productPrice || 0
      );
    }
  }, [location.state, trackPurchase]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-green-500 rounded-xl overflow-hidden animate-scale-in">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-white pb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-green-600 font-medium">
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-8">
          <p className="text-gray-700">Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 my-6 flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <ShoppingBag className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-green-800 font-medium">Um e-mail com os detalhes da compra foi enviado para você.</p>
              <p className="text-green-700 text-sm mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-8">
          <Button asChild className="bg-asaas-primary hover:bg-asaas-secondary px-6 py-2 h-auto transition-all duration-300 shadow-md hover:shadow-lg">
            <Link to="/" className="flex items-center">
              Voltar ao início
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
