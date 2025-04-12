
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CountdownBanner } from '@/components/CountdownBanner';
import { ShoppingCart, Package, CreditCard, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  // Create a countdown end time 15 minutes from now
  const countdownEndTime = new Date();
  countdownEndTime.setMinutes(countdownEndTime.getMinutes() + 15);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CountdownBanner 
        message="Oferta por tempo limitado! Aproveite agora!"
        endTime={countdownEndTime}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-5xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">Checkout Simples e Rápido</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              A melhor plataforma de pagamentos para o seu negócio. Aceite PIX e cartão de crédito com facilidade.
            </p>
            <Link to="/checkout">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
              >
                Experimentar Checkout <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Feature Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <ShoppingCart className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Checkout Simplificado</h3>
              <p className="text-gray-600">
                Processo de pagamento otimizado para aumentar suas conversões e reduzir abandonos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <CreditCard className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Múltiplos Métodos</h3>
              <p className="text-gray-600">
                Aceite PIX e cartão de crédito com total segurança e praticidade para seus clientes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <Package className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Produtos Digitais</h3>
              <p className="text-gray-600">
                Venda infoprodutos, cursos e outros itens digitais com entrega automática.
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Pronto para começar?</h2>
            <p className="text-gray-600 mb-6">
              Experimente agora mesmo nossa plataforma de checkout e aumente suas conversões.
            </p>
            <Link to="/checkout">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Ir para Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2025 Pix Flow Checkout. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
