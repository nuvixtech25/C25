
import React from "react";

interface OrdersFooterProps {
  count: number;
  totalValue: number;
}

const OrdersFooter: React.FC<OrdersFooterProps> = ({ count, totalValue }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm mt-4 flex flex-col md:flex-row md:justify-between">
      <div className="mb-2 md:mb-0">
        <span className="text-sm text-gray-500">Total de pedidos:</span>{" "}
        <span className="font-medium">{count}</span>
      </div>
      <div>
        <span className="text-sm text-gray-500">Valor total:</span>{" "}
        <span className="font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalValue)}
        </span>
      </div>
    </div>
  );
};

export default OrdersFooter;
