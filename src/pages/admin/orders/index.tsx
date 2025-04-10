
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersFilters from "@/components/admin/orders/OrdersFilters";
import OrdersFooter from "@/components/admin/orders/OrdersFooter";
import { 
  CustomerModal, 
  PaymentModal, 
  StatusModal, 
  DeleteConfirmModal 
} from "@/components/admin/orders/OrderModals";
import { useOrders } from "@/hooks/admin/useOrders";
import { Order, PaymentStatus } from "@/types/checkout";

const OrdersPage: React.FC = () => {
  const {
    orders,
    loading,
    paymentMethod,
    statusFilter,
    dateRange,
    customDateRange,
    ordersSummary,
    setStatusFilter,
    setDateRange,
    setCustomDateRange,
    changePaymentMethod,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrders,
  } = useOrders();

  // State for modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  
  // Handlers for order actions
  const handleViewCustomer = (order: Order) => {
    setSelectedOrder(order);
    setShowCustomerModal(true);
  };

  const handleViewPayment = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleChangeStatus = (status: PaymentStatus) => {
    if (selectedOrder?.id) {
      updateOrderStatus(selectedOrder.id, status);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setSelectedOrder(orders.find(o => o.id === orderId) || null);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrder?.id) {
      deleteOrder(selectedOrder.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllOrders();
    setShowDeleteAllConfirm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAll}
          className="flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Apagar todos
        </Button>
      </div>

      <Tabs 
        defaultValue="pix" 
        onValueChange={(value) => changePaymentMethod(value as "pix" | "creditCard")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pix">Pedidos PIX</TabsTrigger>
          <TabsTrigger value="creditCard">Pedidos Cartão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pix" className="mt-4">
          <OrdersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
          
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewCustomer={handleViewCustomer}
            onViewPayment={handleViewPayment}
            onEditStatus={handleEditStatus}
            onDeleteOrder={handleDeleteOrder}
          />
          
          <OrdersFooter
            count={ordersSummary.count}
            totalValue={ordersSummary.totalValue}
          />
        </TabsContent>
        
        <TabsContent value="creditCard" className="mt-4">
          <OrdersFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
          
          <OrdersTable
            orders={orders}
            loading={loading}
            onViewCustomer={handleViewCustomer}
            onViewPayment={handleViewPayment}
            onEditStatus={handleEditStatus}
            onDeleteOrder={handleDeleteOrder}
          />
          
          <OrdersFooter
            count={ordersSummary.count}
            totalValue={ordersSummary.totalValue}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CustomerModal
        order={selectedOrder}
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
      
      <PaymentModal
        order={selectedOrder}
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
      
      <StatusModal
        order={selectedOrder}
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onChangeStatus={handleChangeStatus}
      />
      
      <DeleteConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        isDeleteAll={false}
      />
      
      <DeleteConfirmModal
        open={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleConfirmDeleteAll}
        isDeleteAll={true}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default OrdersPage;
