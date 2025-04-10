
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import OrderRow from './OrderRow';

interface OrdersTableProps {
  orders: any[] | null;
  isLoading: boolean;
  processingOrders: Record<string, boolean>;
  onSimulatePayment: (asaasPaymentId: string, orderId: string) => Promise<void>;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders,
  isLoading,
  processingOrders,
  onSimulatePayment
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                isProcessing={!!processingOrders[order.id]}
                onSimulatePayment={onSimulatePayment}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Nenhum pedido encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
