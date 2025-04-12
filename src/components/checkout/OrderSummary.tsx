import React from 'react';
import { Product } from '@/types/checkout';
import { Shield } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ product, isDigitalProduct = true }) => {
  return (
    <section id="order-summary-section" className="mb-8">
      <SectionTitle number={4} title="Resumo do pedido" />
      
      <div className="border border-[#E0E0E0] rounded-lg p-4 bg-white">
        <h3 className="font-bold text-sm mb-4">Sua Compra</h3>
        
        <div className="flex items-center py-3 border-b border-[#E0E0E0]">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded p-2 mr-3 flex items-center justify-center">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                Imagem
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h4 className="font-medium text-sm">{product.name}</h4>
            <p className="text-xs text-gray-600">1 item</p>
          </div>
          
          <div className="flex-shrink-0 font-medium">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </div>
        </div>
        
        <div className="pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>TOTAL:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
          </div>
        </div>
        
        <div className="mt-4 border-t border-[#E0E0E0] pt-4 text-center">
          <div className="flex items-center justify-center text-xs text-gray-600">
            <Shield className="w-4 h-4 mr-1" />
            <span>Compra segura e protegida</span>
          </div>
          
          {isDigitalProduct && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              *Produto digital: entrega imediata após confirmação do pagamento
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
