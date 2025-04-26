
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import OrdersFooter from "./OrdersFooter";
import { Order, PaymentMethod, PaymentStatus } from "@/types/checkout";

interface OrdersTabsProps {
  paymentMethod: PaymentMethod;
  orders: Order[];
  loading: boolean;
  statusFilter: PaymentStatus | "ALL";
  dateRange: "7days" | "30days" | "custom";
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  ordersSummary: {
    count: number;
    totalValue: number;
  };
  onChangePaymentMethod: (method: PaymentMethod) => void;
  setStatusFilter: (status: PaymentStatus | "ALL") => void;
  setDateRange: (range: "7days" | "30days" | "custom") => void;
  setCustomDateRange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  onViewCustomer: (order: Order) => void;
  onViewPayment: (order: Order) => void;
  onEditStatus: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({
  paymentMethod,
  orders,
  loading,
  statusFilter,
  dateRange,
  customDateRange,
  ordersSummary,
  onChangePaymentMethod,
  setStatusFilter,
  setDateRange,
  setCustomDateRange,
  onViewCustomer,
  onViewPayment,
  onEditStatus,
  onDeleteOrder,
}) => {
  return (
    <Tabs 
      defaultValue={paymentMethod} 
      value={paymentMethod}
      onValueChange={(value) => onChangePaymentMethod(value as PaymentMethod)}
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
          onViewCustomer={onViewCustomer}
          onViewPayment={onViewPayment}
          onEditStatus={onEditStatus}
          onDeleteOrder={onDeleteOrder}
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
          onViewCustomer={onViewCustomer}
          onViewPayment={onViewPayment}
          onEditStatus={onEditStatus}
          onDeleteOrder={onDeleteOrder}
        />
        
        <OrdersFooter
          count={ordersSummary.count}
          totalValue={ordersSummary.totalValue}
        />
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTabs;
