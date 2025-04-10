
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const WebhookSimulator = () => {
  const { toast } = useToast();
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});

  // Buscar todos os pedidos
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

  // Função para simular um webhook de pagamento confirmado
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
      // Enviar o webhook simulado para a função Netlify
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

      const result = await response.json();
      
      toast({
        title: 'Webhook simulado com sucesso',
        description: 'O status do pedido foi atualizado para CONFIRMED.',
      });
      
      // Atualizar a lista de pedidos
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

  // Formatador de data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Simulador de Webhook</h1>
        <Button onClick={() => refetch()} variant="outline">
          Atualizar
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID do Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.product_price)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{order.payment_method === 'pix' ? 'PIX' : 'Cartão'}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => simulatePaymentConfirmed(order.asaas_payment_id, order.id)}
                      disabled={processingOrders[order.id] || order.status === 'CONFIRMED' || !order.asaas_payment_id}
                      size="sm"
                    >
                      {processingOrders[order.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processando...
                        </>
                      ) : order.status === 'CONFIRMED' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Já confirmado
                        </>
                      ) : (
                        "Simular Pagamento Confirmado"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Componente para exibir o status do pagamento com cores
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'CONFIRMED':
        return { color: 'bg-green-100 text-green-800', label: 'Confirmado' };
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' };
      case 'RECEIVED':
        return { color: 'bg-blue-100 text-blue-800', label: 'Recebido' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', label: 'Cancelado' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const { color, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default WebhookSimulator;
