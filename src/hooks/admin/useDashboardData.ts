
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

// Type for the data accumulator
interface DataAccumulator {
  [key: string]: {
    count: number;
    revenue: number;
  };
}

export const useDashboardData = () => {
  const fetchDashboardData = async () => {
    const today = new Date();
    const last7Days = subDays(today, 7);
    const last30Days = subDays(today, 30);
    
    // Format dates for Supabase queries
    const todayStart = startOfDay(today).toISOString();
    const todayEnd = endOfDay(today).toISOString();
    const last7DaysStart = startOfDay(last7Days).toISOString();
    const last30DaysStart = startOfDay(last30Days).toISOString();
    const monthStart = startOfMonth(today).toISOString();
    const monthEnd = endOfMonth(today).toISOString();

    // Fetch all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch dashboard data');
    }

    // Calculate key metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.product_price), 0);
    const confirmedOrders = orders.filter(order => order.status === 'CONFIRMED');
    const totalConfirmedRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
    
    // Calculate today's metrics
    const todayOrders = orders.filter(order => 
      new Date(order.created_at) >= new Date(todayStart) && 
      new Date(order.created_at) <= new Date(todayEnd)
    );
    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
    
    // Calculate this month's metrics
    const thisMonthOrders = orders.filter(order => 
      new Date(order.created_at) >= new Date(monthStart) && 
      new Date(order.created_at) <= new Date(monthEnd)
    );
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
    
    // Calculate order status distribution
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      const status = order.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Calculate payment method distribution
    const paymentMethodCounts: Record<string, number> = {};
    orders.forEach(order => {
      const method = order.payment_method;
      paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
    });
    
    // Prepare time series data for last 7 days
    const last7DaysData: DataAccumulator = {};
    
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      last7DaysData[dateStr] = { count: 0, revenue: 0 };
    }
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= new Date(last7DaysStart)) {
        const dateStr = format(orderDate, 'yyyy-MM-dd');
        if (last7DaysData[dateStr]) {
          last7DaysData[dateStr].count += 1;
          last7DaysData[dateStr].revenue += Number(order.product_price);
        }
      }
    });
    
    // Convert the data to arrays for charts
    const last7DaysOrders = Object.entries(last7DaysData).map(([date, data]) => ({
      date,
      count: data.count,
    })).reverse();
    
    const last7DaysRevenue = Object.entries(last7DaysData).map(([date, data]) => ({
      date,
      value: data.revenue,
    })).reverse();
    
    // Prepare time series data for last 30 days
    const last30DaysData: DataAccumulator = {};
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      last30DaysData[dateStr] = { count: 0, revenue: 0 };
    }
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= new Date(last30DaysStart)) {
        const dateStr = format(orderDate, 'yyyy-MM-dd');
        if (last30DaysData[dateStr]) {
          last30DaysData[dateStr].count += 1;
          last30DaysData[dateStr].revenue += Number(order.product_price);
        }
      }
    });
    
    // Summarize data for display
    return {
      totalOrders,
      totalRevenue: formatCurrency(totalRevenue),
      totalRevenueRaw: totalRevenue,
      confirmedOrders: confirmedOrders.length,
      confirmedRevenue: formatCurrency(totalConfirmedRevenue),
      confirmedRevenueRaw: totalConfirmedRevenue,
      conversionRate: totalOrders > 0 ? (confirmedOrders.length / totalOrders * 100).toFixed(1) : '0',
      todayOrders: todayOrders.length,
      todayRevenue: formatCurrency(todayRevenue),
      thisMonthOrders: thisMonthOrders.length,
      thisMonthRevenue: formatCurrency(thisMonthRevenue),
      statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      paymentMethodData: Object.entries(paymentMethodCounts).map(([name, value]) => ({ name, value })),
      last7DaysOrders,
      last7DaysRevenue,
      ordersRaw: orders
    };
  };

  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
};
