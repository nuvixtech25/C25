
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

  return {
    orders,
    isLoading,
    processingOrders,
    statusFilter,
    setStatusFilter,
    simulatePaymentConfirmed,
    refetch
  };
};
