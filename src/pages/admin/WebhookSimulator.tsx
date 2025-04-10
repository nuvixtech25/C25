
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';
import { useWebhookSimulator } from '@/hooks/admin/useWebhookSimulator';
import OrdersTable from '@/components/admin/webhook/OrdersTable';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaymentStatus } from '@/types/checkout';

const WebhookSimulator = () => {
  const {
    orders,
    isLoading,
    processingOrders,
    statusFilter,
    setStatusFilter,
    simulatePaymentConfirmed,
    refetch
  } = useWebhookSimulator();

  const statusOptions: Array<{ value: PaymentStatus | 'ALL', label: string }> = [
    { value: 'ALL', label: 'Todos os status' },
    { value: 'PENDING', label: 'Pendente' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'RECEIVED', label: 'Recebido' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Simulador de Webhook</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'ALL')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
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
