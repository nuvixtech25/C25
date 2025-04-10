
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Order, PaymentMethod } from '@/types/checkout';

const FailedPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get order from location state if available
    if (state?.order) {
      setOrder(state.order);
    }
  }, [state]);

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
        </CardFooter>
      </Card>
    </div>
  );
};

export default FailedPage;
