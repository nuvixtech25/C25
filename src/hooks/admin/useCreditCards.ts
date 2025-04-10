
import { useState, useEffect, useMemo } from "react";
import { orderAdminService } from "@/services/orderAdminService";
import { Order } from "@/types/checkout";
import { useToast } from "@/hooks/use-toast";

export function useCreditCards() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Summary calculations
  const ordersSummary = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.productPrice), 0);
    
    return {
      count: orders.length,
      totalValue: total,
    };
  }, [orders]);

  // Fetch credit card orders
  const fetchCreditCardOrders = async () => {
    setLoading(true);
    try {
      const data = await orderAdminService.getOrders({
        paymentMethod: "creditCard",
      });
      setOrders(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar cartões",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a card order
  const deleteOrder = async (orderId: string) => {
    try {
      await orderAdminService.deleteOrder(orderId);
      toast({
        title: "Registro excluído",
        description: "O registro do cartão foi excluído com sucesso",
      });
      // Update local state to remove the deleted order
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir registro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchCreditCardOrders();
  }, []);

  return {
    orders,
    loading,
    ordersSummary,
    deleteOrder,
    fetchCreditCardOrders,
  };
}
