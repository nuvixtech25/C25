
import { useState } from 'react';
import { Order } from '@/types/checkout';

export function useOrdersState() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  return {
    orders,
    loading,
    setOrders,
    setLoading
  };
}
