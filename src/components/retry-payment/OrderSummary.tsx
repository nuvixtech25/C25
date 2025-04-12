
import React from 'react';
import { Order } from '@/types/checkout';

interface OrderSummaryProps {
  order: Order | null;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  if (!order) return null;
  
  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
      <p className="text-sm font-medium text-gray-500">Resumo do pedido</p>
      <p className="mt-1 font-medium">{order.productName}</p>
      <p className="mt-1 text-lg font-bold">
        R$ {Number(order.productPrice).toFixed(2).replace('.', ',')}
      </p>
    </div>
  );
};
