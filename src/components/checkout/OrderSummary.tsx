
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  isDigitalProduct
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Resumo do pedido</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded mr-3"
              />
            )}
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-300 mt-1">{product.description}</p>
            </div>
          </div>
          
          {isDigitalProduct && (
            <div className="bg-asaas-light/30 p-3 rounded-lg mt-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-asaas-primary mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16"></path>
                <path d="M9 4v16"></path>
                <path d="M15 4h5v4h-5z"></path>
                <path d="M15 12h5v8h-5z"></path>
              </svg>
              <p className="text-sm">
                <span className="font-medium">Produto digital.</span> Após a confirmação do pagamento, você receberá o acesso por e-mail.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3 pt-4 border-t border-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-600">
            <span>Total</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span className="text-sm text-gray-300">Pagamento 100% seguro</span>
          </div>
          
          <div className="flex justify-center mt-4">
            <img 
              src="https://via.placeholder.com/300x40?text=Bandeiras+de+Cartões" 
              alt="Bandeiras de cartões aceitas" 
              className="h-8 object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
