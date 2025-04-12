
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import { Shield, Check } from 'lucide-react';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  isDigitalProduct
}) => {
  return (
    <Card className="bg-[#242424] border border-gray-700 shadow-lg rounded-xl overflow-hidden text-white">
      <CardHeader className="border-b border-gray-700 bg-[#2A2A2A] pb-4">
        <CardTitle className="text-xl font-bold text-center">Resumo do pedido</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
            )}
            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-300 mt-1">{product.description}</p>
            </div>
          </div>
          
          {isDigitalProduct && (
            <div className="bg-[#333333] p-4 rounded-lg mt-4 flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                <span className="font-medium">Produto digital.</span> Após a confirmação do pagamento, você receberá o acesso por e-mail.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3 pt-4 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-700">
            <span>Total</span>
            <span className="text-green-400">{formatCurrency(product.price)}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-300">Pagamento 100% seguro</span>
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            <img 
              src="https://via.placeholder.com/40?text=Visa" 
              alt="Visa" 
              className="h-8 object-contain"
            />
            <img 
              src="https://via.placeholder.com/40?text=Master" 
              alt="Mastercard" 
              className="h-8 object-contain"
            />
            <img 
              src="https://via.placeholder.com/40?text=Pix" 
              alt="Pix" 
              className="h-8 object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
