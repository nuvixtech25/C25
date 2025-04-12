
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import { ShieldCheck, CreditCard, QrCode } from 'lucide-react';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  isDigitalProduct
}) => {
  return (
    <div className="bg-[#242424] rounded-xl border border-gray-700 overflow-hidden text-white shadow-lg">
      <div className="bg-[#2A2A2A] p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">Resumo do pedido</h2>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
          )}
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-300">{product.description}</p>
          </div>
        </div>
        
        {isDigitalProduct && (
          <div className="bg-[#333333] p-4 rounded-lg mb-6 flex items-start">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
            <p className="text-sm">
              Produto digital. Após a confirmação do pagamento, você receberá o acesso por e-mail.
            </p>
          </div>
        )}
        
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
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-300">Pagamento 100% seguro</span>
          </div>
          
          <div className="flex justify-center space-x-4">
            <CreditCard className="h-8 w-8 text-gray-300" />
            <QrCode className="h-8 w-8 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
