
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useWebhookSimulator } from '@/hooks/admin/useWebhookSimulator';
import OrdersTable from '@/components/admin/webhook/OrdersTable';

const WebhookSimulator = () => {
  const {
    orders,
    isLoading,
    processingOrders,
    simulatePaymentConfirmed,
    refetch
  } = useWebhookSimulator();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Simulador de Webhook</h1>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        processingOrders={processingOrders}
        onSimulatePayment={simulatePaymentConfirmed}
      />
    </div>
  );
};

export default WebhookSimulator;
