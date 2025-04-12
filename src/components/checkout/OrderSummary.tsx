
import React from 'react';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import { ShieldCheck, Lock } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  isDigitalProduct
}) => {
  return (
    <div className="mb-8">
      <SectionTitle number={4} title="Resumo do pedido" />
      
      <div className="border border-[#E0E0E0] rounded-md p-4 bg-white">
        <h3 className="font-bold text-sm mb-4">Sua Compra</h3>
        
        <div className="flex items-center mb-4">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Sem imagem</span>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-sm">{product.name}</h4>
            <p className="text-xs text-gray-500">1 item</p>
            <p className="font-medium text-sm">{formatCurrency(product.price)}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-[#E0E0E0]">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          
          <div className="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-center text-xs text-[#666666]">
          <Lock className="h-3 w-3 mr-1" />
          <span>Compra segura e protegida</span>
        </div>
      </div>
    </div>
  );
};
