
import React from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from '@/components/ui/table';
import StatusBadge from './StatusBadge';
import SimulatePaymentButton from './SimulatePaymentButton';

interface OrderRowProps {
  order: {
    id: string;
    customer_name: string;
    product_price: number;
    status: string;
    payment_method: string;
    created_at: string;
    asaas_payment_id?: string;
  };
  isProcessing: boolean;
  onSimulatePayment: (asaasPaymentId: string | null, orderId: string, isManualCard?: boolean) => Promise<void>;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, isProcessing, onSimulatePayment }) => {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TableRow key={order.id}>
      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
      <TableCell>{order.customer_name}</TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.product_price)}
      </TableCell>
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell>{order.payment_method === 'pix' ? 'PIX' : 'Cartão'}</TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell className="text-right">
        <SimulatePaymentButton
          asaasPaymentId={order.asaas_payment_id || null}
          orderId={order.id}
          orderStatus={order.status}
          paymentMethod={order.payment_method}
          isProcessing={isProcessing}
          onSimulate={onSimulatePayment}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
