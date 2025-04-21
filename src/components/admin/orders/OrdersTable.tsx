
import React from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useOrdersList } from "@/hooks/admin/orders/useOrdersList";
import OrdersTableRow from "./orders-table/OrdersTableRow";
import OrdersTableEmptyState from "./orders-table/OrdersTableEmptyState";
import { Order } from "@/types/checkout";

interface OrdersTableProps {
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
}) => {
  const { 
    orders, 
    totalOrders, 
    loading, 
    currentPage, 
    itemsPerPage, 
    paginate 
  } = useOrdersList();

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 font-medium">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <OrdersTableEmptyState />;
  }

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <div className="space-y-4">
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
                <OrdersTableRow
                  key={order.id}
                  order={order}
                  onViewCustomer={onViewCustomer}
                  onViewPayment={onViewPayment}
                  onEditStatus={onEditStatus}
                  onDeleteOrder={onDeleteOrder}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => paginate(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => paginate(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OrdersTable;
