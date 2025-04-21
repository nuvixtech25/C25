
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import StatusBadge from "../StatusBadge";
import { Order } from "@/types/checkout";
import OrdersTableActions from "./OrdersTableActions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

interface OrdersTableRowProps {
  order: Order;
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const formatPrice = (price: any): string => {
  const numericPrice = Number(price);
  return !isNaN(numericPrice) ? formatCurrency(numericPrice) : "R$ --";
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Data não disponível";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch {
    return "Data inválida";
  }
};

const OrdersTableRow: React.FC<OrdersTableRowProps> = ({
  order,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
}) => (
  <TableRow>
    <TableCell className="font-medium">{order.customerName || "Nome não disponível"}</TableCell>
    <TableCell>{order.customerEmail || "Email não disponível"}</TableCell>
    <TableCell>{formatPrice(order.productPrice)}</TableCell>
    <TableCell>
      <StatusBadge status={order.status} />
    </TableCell>
    <TableCell>{formatDate(order.createdAt)}</TableCell>
    <TableCell className="text-right">
      <OrdersTableActions
        order={order}
        onViewCustomer={onViewCustomer}
        onViewPayment={onViewPayment}
        onEditStatus={onEditStatus}
        onDeleteOrder={onDeleteOrder}
      />
    </TableCell>
  </TableRow>
);

export default OrdersTableRow;
