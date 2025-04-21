
import React from "react";
import { AlertTriangle } from "lucide-react";

const OrdersTableEmptyState: React.FC = () => (
  <div className="bg-white p-8 text-center rounded-md shadow-sm">
    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
    <p className="text-gray-700 font-medium">Nenhum pedido encontrado.</p>
    <p className="text-gray-500 mt-2">
      Verifique os filtros aplicados ou se existem pedidos no sistema.
    </p>
  </div>
);

export default OrdersTableEmptyState;
