
import React from 'react';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import { SectionTitle } from './SectionTitle';

interface OrderSummaryProps {
  product: Product;
  isDigitalProduct?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ product, isDigitalProduct = true }) => {
  return (
    <section className="bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <SectionTitle number={4} title="Resumo do Pedido" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Produto:</span>
            <span className="font-medium">{product.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">Tipo:</span>
            <span>{isDigitalProduct ? 'Digital' : 'Físico'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">Entrega:</span>
            <span>{isDigitalProduct ? 'Acesso Imediato' : 'Envio em até 7 dias'}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>Ao finalizar a compra, você concorda com os termos de uso e política de privacidade.</p>
            {isDigitalProduct && (
              <p className="mt-1">
                Por ser um produto digital, não há direito de arrependimento após o acesso ao conteúdo.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
