
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Edit, DollarSign, CreditCard } from "lucide-react";
import { Order } from "@/types/checkout";

interface OrdersTableActionsProps {
  order: Order;
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTableActions: React.FC<OrdersTableActionsProps> = ({
  order,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
}) => (
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
      title="Ver dados de pagamento"
    >
      {order.paymentMethod === "pix" ? (
        <DollarSign className="h-4 w-4 text-green-600" />
      ) : (
        <CreditCard className="h-4 w-4 text-blue-600" />
      )}
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
);

export default OrdersTableActions;
