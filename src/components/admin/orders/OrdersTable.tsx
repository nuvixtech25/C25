
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/checkout";
import StatusBadge from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrdersTableProps {
  orders: Order[];
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  loading: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
  loading,
}) => {
  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-500">Carregando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-md shadow-sm">
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.customerName}
                </TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(order.productPrice))}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewCustomer(order)}
                      title="Ver dados do cliente"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewPayment(order)}
                      title="Ver dados do pagamento"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditStatus(order)}
                      title="Editar status"
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDeleteOrder(order.id!)}
                      title="Excluir pedido"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
