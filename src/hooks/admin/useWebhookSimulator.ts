
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWebhookSimulator = () => {
  const { toast } = useToast();
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});

  // Fetch all orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
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
      // Send the simulated webhook to the Netlify function
      const response = await fetch('/.netlify/functions/asaas-webhook', {
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
        throw new Error(`Erro ao simular webhook: ${response.statusText}`);
      }

      await response.json();
      
      toast({
        title: 'Webhook simulado com sucesso',
        description: 'O status do pedido foi atualizado para CONFIRMED.',
      });
      
      // Update the orders list
      refetch();
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
    simulatePaymentConfirmed,
    refetch
  };
};
