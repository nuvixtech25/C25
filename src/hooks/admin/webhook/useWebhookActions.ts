
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WebhookEventType } from './types';
import { PaymentStatus } from '@/types/checkout';

export const useWebhookActions = (
  setProcessingOrders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  refetch: () => Promise<any>
) => {
  const { toast } = useToast();

  // Function to simulate a webhook with the selected event
  const simulatePaymentWebhook = async (
    asaasPaymentId: string | null, 
    orderId: string, 
    selectedEvent: WebhookEventType,
    isManualCard: boolean = false
  ) => {
    if (!asaasPaymentId && !isManualCard) {
      toast({
        title: 'Erro',
        description: 'Este pedido não possui um ID de pagamento do Asaas.',
        variant: 'destructive'
      });
      return;
    }

    setProcessingOrders(prev => ({ ...prev, [orderId]: true }));

    try {
      // Using relative path which works in both Vite dev server and production
      const webhookEndpoint = '/api/webhook-simulator';
      
      console.log(`Using webhook endpoint: ${webhookEndpoint} for order ID: ${orderId}`);
      console.log(`Is manual card: ${isManualCard}, Asaas Payment ID: ${asaasPaymentId || 'None'}`);
      console.log(`Selected event: ${selectedEvent}`);
      
      // Determine the new status based on the event
      let newStatus: PaymentStatus = 'PENDING';
      switch (selectedEvent) {
        case 'PAYMENT_RECEIVED':
        case 'PAYMENT_CONFIRMED':
          newStatus = 'CONFIRMED';
          break;
        case 'PAYMENT_OVERDUE':
          newStatus = 'OVERDUE';
          break;
        case 'PAYMENT_CANCELED':
        case 'PAYMENT_REFUSED':
          newStatus = 'CANCELLED';
          break;
      }
      
      // Prepare payload based on whether this is a manual card or asaas payment
      const payload = isManualCard 
        ? {
            event: selectedEvent,
            payment: {
              id: "manual_card_payment",
              status: newStatus
            },
            orderId: orderId // Include orderId for manual card payments
          }
        : {
            event: selectedEvent,
            payment: {
              id: asaasPaymentId,
              status: newStatus
            }
          };
      
      // Send the simulated webhook
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao simular webhook: ${errorText}`);
      }

      const result = await response.json();
      console.log('Webhook simulation result:', result);
      
      toast({
        title: 'Webhook simulado com sucesso',
        description: `O status do pedido foi atualizado para ${newStatus}.`,
      });
      
      // Update the orders list
      await refetch();
    } catch (error) {
      console.error('Erro ao simular webhook:', error);
      toast({
        title: 'Erro ao simular webhook',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        variant: 'destructive'
      });
    } finally {
      setProcessingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Function to delete all webhook logs
  const deleteAllWebhookLogs = async () => {
    try {
      console.log('Attempting to delete all webhook logs');
      
      // First, check if there are any records
      const { data: records, error: checkError } = await supabase
        .from('asaas_webhook_logs')
        .select('id', { count: 'exact' });
      
      if (checkError) {
        console.error('Error checking webhook logs:', checkError);
        throw checkError;
      }
      
      const recordCount = records?.length || 0;
      console.log(`Found ${recordCount} webhook logs to delete`);
      
      if (recordCount === 0) {
        toast({
          title: 'Nenhum registro encontrado',
          description: 'Não há registros de webhook para excluir.',
        });
        return;
      }
      
      // Use a different approach to delete all records
      const { error: deleteError } = await supabase
        .from('asaas_webhook_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Will match all valid UUIDs
      
      if (deleteError) {
        console.error('Error deleting records:', deleteError);
        throw deleteError;
      }
      
      console.log(`Successfully deleted ${recordCount} webhook logs`);
      
      toast({
        title: 'Registros excluídos',
        description: `${recordCount} registros de webhook foram excluídos com sucesso.`,
      });
      
      // Refresh the orders list
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir registros:', error);
      toast({
        title: 'Erro ao excluir registros',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        variant: 'destructive'
      });
    }
  };

  return {
    simulatePaymentWebhook,
    deleteAllWebhookLogs
  };
};
