
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-asaas-light/30">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-green-500">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p>Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 my-4">
            <p className="text-green-800">Um e-mail com os detalhes da compra foi enviado para você.</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-asaas-primary hover:bg-asaas-secondary">
            <Link to="/">Voltar ao início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
