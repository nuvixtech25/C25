
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { PaymentStatus } from '@/types/checkout';

export function useDashboardData() {
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date();
      let startDate = now;
      
      if (period === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (period === '7days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
      }
      
      // Format dates for Supabase query
      const startDateStr = period === 'all' ? undefined : startDate.toISOString();
      
      // Fetch total orders
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr);
      
      // Fetch total revenue
      const { data: orderData, error: revenueError } = await supabase
        .from('orders')
        .select('product_price')
        .gte('created_at', startDateStr);
      
      const totalRevenue = orderData?.reduce((sum, order) => 
        sum + Number(order.product_price), 0) || 0;
      
      // Fetch credit cards captured
      const { count: cardsCount, error: cardsError } = await supabase
        .from('card_data')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr);
      
      // Visitor count (approximated based on orders for now)
      // In a real app, you would use analytics data from a proper service
      const estimatedVisitors = Math.floor((ordersCount || 0) * 5.2); // estimation for example
      
      return {
        totalOrders: ordersCount || 0,
        totalRevenue: totalRevenue || 0,
        cardsCaptures: cardsCount || 0,
        visitors: estimatedVisitors,
      };
    },
  });
  
  // Fetch order data for charts
  const { data: ordersOverTime, isLoading: ordersChartLoading } = useQuery({
    queryKey: ['orders-over-time', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date();
      let startDate = now;
      let interval = '1 day';
      
      if (period === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        interval = '1 hour';
      } else if (period === '7days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
      } else {
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        interval = '1 month';
      }
      
      // Format date for Supabase query
      const startDateStr = startDate.toISOString();
      
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, product_price, payment_method, status')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching orders data:', error);
        return [];
      }
      
      // Process data by day for charts
      const dateGroups = data.reduce((acc, order) => {
        const date = new Date(order.created_at);
        let key = '';
        
        if (period === 'today') {
          key = `${date.getHours()}:00`;
        } else if (period === '7days' || period === '30days') {
          key = format(date, 'MM/dd');
        } else {
          key = format(date, 'MMM yyyy');
        }
        
        if (!acc[key]) {
          acc[key] = {
            date: key,
            orders: 0,
            revenue: 0,
            pix: 0,
            creditCard: 0,
            completed: 0,
            pending: 0,
          };
        }
        
        acc[key].orders += 1;
        acc[key].revenue += Number(order.product_price);
        
        // Payment method stats
        if (order.payment_method === 'pix') {
          acc[key].pix += 1;
        } else if (order.payment_method === 'creditCard') {
          acc[key].creditCard += 1;
        }
        
        // Status stats
        if (order.status === 'CONFIRMED' || order.status === 'RECEIVED') {
          acc[key].completed += 1;
        } else if (order.status === 'PENDING') {
          acc[key].pending += 1;
        }
        
        return acc;
      }, {});
      
      // Convert to array and sort by date
      return Object.values(dateGroups);
    },
  });
  
  // Fetch payment method distribution
  const { data: paymentDistribution, isLoading: paymentDistLoading } = useQuery({
    queryKey: ['payment-distribution', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date();
      let startDate = now;
      
      if (period === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (period === '7days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
      }
      
      // Format date for Supabase query
      const startDateStr = period === 'all' ? undefined : startDate.toISOString();
      
      const { data, error } = await supabase
        .from('orders')
        .select('payment_method, count')
        .gte('created_at', startDateStr)
        .select();
      
      if (error) {
        console.error('Error fetching payment distribution:', error);
        return [];
      }
      
      // Count by payment method
      const counts = data.reduce((acc, order) => {
        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
        return acc;
      }, {});
      
      // Format for pie chart
      return [
        { name: 'PIX', value: counts.pix || 0, color: '#10B981' },
        { name: 'Cartão de Crédito', value: counts.creditCard || 0, color: '#8B5CF6' },
      ];
    },
  });
  
  // Status distribution
  const { data: statusDistribution, isLoading: statusDistLoading } = useQuery({
    queryKey: ['status-distribution', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date();
      let startDate = now;
      
      if (period === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (period === '7days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
      }
      
      // Format date for Supabase query
      const startDateStr = period === 'all' ? undefined : startDate.toISOString();
      
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .gte('created_at', startDateStr);
      
      if (error) {
        console.error('Error fetching status distribution:', error);
        return [];
      }
      
      // Count by status
      const counts: Record<PaymentStatus, number> = {
        PENDING: 0,
        CONFIRMED: 0,
        RECEIVED: 0,
        CANCELLED: 0,
        REFUNDED: 0,
        OVERDUE: 0
      };
      
      // Count occurrences of each status
      data.forEach(order => {
        if (order.status && counts.hasOwnProperty(order.status)) {
          counts[order.status as PaymentStatus] += 1;
        }
      });
      
      // Format for bar chart
      return [
        { name: 'Pendente', value: counts.PENDING || 0, color: '#F59E0B' },
        { name: 'Confirmado', value: (counts.CONFIRMED || 0) + (counts.RECEIVED || 0), color: '#10B981' },
        { name: 'Cancelado', value: counts.CANCELLED || 0, color: '#EF4444' },
        { name: 'Reembolsado', value: counts.REFUNDED || 0, color: '#6B7280' },
        { name: 'Vencido', value: counts.OVERDUE || 0, color: '#EC4899' },
      ];
    },
  });

  return {
    period,
    setPeriod,
    stats,
    statsLoading,
    ordersOverTime,
    ordersChartLoading,
    paymentDistribution,
    paymentDistLoading,
    statusDistribution,
    statusDistLoading
  };
}
