
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/types/checkout';

export const useWebhookSimulator = () => {
  const { toast } = useToast();
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  // Fetch all orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if not set to ALL
      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Function to simulate a confirmed payment webhook
  const simulatePaymentConfirmed = async (asaasPaymentId: string, orderId: string) => {
    if (!asaasPaymentId) {
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
      
      console.log(`Using webhook endpoint: ${webhookEndpoint} for payment ID: ${asaasPaymentId}`);
      
      // Send the simulated webhook
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: "PAYMENT_RECEIVED",
          payment: {
            id: asaasPaymentId,
            status: "CONFIRMED"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao simular webhook: ${errorText}`);
      }

      const result = await response.json();
      console.log('Webhook simulation result:', result);
      
      toast({
        title: 'Webhook simulado com sucesso',
        description: 'O status do pedido foi atualizado para CONFIRMED.',
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
      
      // Delete records from asaas_webhook_logs table with an explicit condition
      const { error, count } = await supabase
        .from('asaas_webhook_logs')
        .delete({ count: 'exact' })
        .gt('id', '00000000-0000-0000-0000-000000000000'); // This ensures we delete all records
      
      if (error) {
        console.error('Error deleting records:', error);
        throw error;
      }
      
      console.log(`Successfully deleted ${count} webhook logs`);
      
      toast({
        title: 'Registros excluídos',
        description: `${count} registros de webhook foram excluídos com sucesso.`,
      });
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
    orders,
    isLoading,
    processingOrders,
    statusFilter,
    setStatusFilter,
    simulatePaymentConfirmed,
    deleteAllWebhookLogs,
    refetch
  };
};
