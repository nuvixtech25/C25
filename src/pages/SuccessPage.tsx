
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, ArrowRight, Star, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { usePixelEvents } from '@/hooks/usePixelEvents';

const SuccessPage = () => {
  const location = useLocation();
  const { trackPurchase } = usePixelEvents();
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  
  useEffect(() => {
    // Track purchase event if we have order data from location state
    if (location.state?.order) {
      const { order } = location.state;
      trackPurchase(
        order.id || 'unknown-order',
        order.productPrice || 0
      );
      
      // Check if the product is digital based on location state
      if (location.state.productType === 'digital') {
        setIsDigitalProduct(true);
      }
    }
  }, [location.state, trackPurchase]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white via-green-50/20 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-300/5 via-green-200/10 to-green-100/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-green-100/5 via-green-200/10 to-green-300/5 pointer-events-none"></div>
      
      {/* Floating circles for decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <Card className="max-w-md w-full shadow-xl border-0 rounded-xl overflow-hidden animate-scale-in relative bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
        
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-white pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,127,0.05),transparent_50%)]"></div>
          
          <div className="relative">
            <div className="absolute inset-0 -mt-2 bg-green-400 rounded-full blur-lg opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-green-700 mt-2">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-green-600 font-medium">
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-8">
          <p className="text-gray-700">Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 my-6 flex items-start shadow-sm">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <ShoppingBag className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-green-800 font-medium">Um e-mail com os detalhes da compra foi enviado para você.</p>
              <p className="text-green-700 text-sm mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
            </div>
          </div>
          
          {isDigitalProduct && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 my-6 flex items-start shadow-sm">
              <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                <Lock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-blue-800 font-medium">Seus dados de acesso estão prontos!</p>
                <p className="text-blue-700 text-sm mt-1">Clique no botão abaixo para ver seus dados de acesso ao produto digital.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-center mt-6">
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            </div>
            <p className="text-sm text-gray-600 italic">"Processo de pagamento muito simples e rápido!"</p>
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
              <span>Transação segura e confirmada</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col pb-8 relative z-10 space-y-3">
          {isDigitalProduct ? (
            <>
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 h-auto transition-all duration-300 shadow-md hover:shadow-lg text-white border-0"
              >
                <Link to="/access-data" className="flex items-center justify-center">
                  Ver dados de acesso
                  <Lock className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2 h-auto transition-all duration-300 shadow-md hover:shadow-lg text-white border-0"
              >
                <Link to="/access-product" className="flex items-center justify-center">
                  Acessar produto
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2 h-auto transition-all duration-300 shadow-md hover:shadow-lg text-white border-0"
            >
              <Link to="/" className="flex items-center justify-center">
                Voltar ao início
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
