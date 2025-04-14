import { useState } from 'react';
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
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');

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
    const last7DaysData: Record<string, { count: number; revenue: number }> = {};
    
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
      orders: data.count, // Add normalized name for chart
    })).reverse();
    
    const last7DaysRevenue = Object.entries(last7DaysData).map(([date, data]) => ({
      date,
      value: data.revenue,
      revenue: data.revenue, // Add normalized name for chart
    })).reverse();
    
    // Prepare time series data for last 30 days
    const last30DaysData: Record<string, { count: number; revenue: number }> = {};
    
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

    // Prepare status distribution with colors for chart
    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => {
      let color = "#6B7280"; // Default gray
      
      switch(name) {
        case "PENDING":
          color = "#F59E0B"; // Amber
          break;
        case "CONFIRMED":
          color = "#10B981"; // Green
          break;
        case "CANCELLED":
          color = "#EF4444"; // Red
          break;
        case "REFUNDED":
          color = "#6B7280"; // Gray
          break;
        case "OVERDUE":
          color = "#EC4899"; // Pink
          break;
      }
      
      return { name, value, color };
    });

    // Prepare payment method distribution with colors for chart
    const paymentDistribution = Object.entries(paymentMethodCounts).map(([name, value]) => {
      let color = "#6B7280"; // Default gray
      
      switch(name) {
        case "pix":
          color = "#10B981"; // Green
          break;
        case "creditCard":
          color = "#8B5CF6"; // Purple
          break;
      }
      
      return { name, value, color };
    });
    
    // Summarize data for display based on period selection
    const filteredOrders = period === 'today' 
      ? todayOrders 
      : period === '7days' 
        ? orders.filter(order => new Date(order.created_at) >= new Date(last7DaysStart))
        : period === '30days'
          ? orders.filter(order => new Date(order.created_at) >= new Date(last30DaysStart))
          : orders;
          
    const filteredRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
    const filteredCardCaptures = filteredOrders.filter(order => order.payment_method === 'creditCard').length;
    // Estimate visitors based on orders (just a placeholder calculation)
    const filteredVisitors = Math.round(filteredOrders.length * 2.5);
    
    // Dashboard stats for the current period
    const stats = {
      totalOrders: filteredOrders.length,
      totalRevenue: filteredRevenue,
      cardsCaptures: filteredCardCaptures,
      visitors: filteredVisitors
    };
    
    // Return the data needed for the dashboard
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
      statusDistribution,
      paymentDistribution,
      ordersOverTime: period === '7days' ? last7DaysOrders : [], // Simplified for now
      last7DaysOrders,
      last7DaysRevenue,
      ordersRaw: orders
    };
  };

  const queryResult = useQuery({
    queryKey: ['dashboardData', period],
    queryFn: fetchDashboardData,
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
  
  const { data, isLoading } = queryResult;
  
  return {
    period,
    setPeriod,
    stats: {
      totalOrders: data?.totalOrders || 0,
      totalRevenue: data?.totalRevenueRaw || 0,
      cardsCaptures: data?.ordersRaw?.filter(order => order.payment_method === 'creditCard').length || 0,
      visitors: data?.totalOrders ? Math.round(data.totalOrders * 2.5) : 0
    },
    statsLoading: isLoading,
    ordersOverTime: data?.ordersOverTime || [],
    paymentDistribution: data?.paymentDistribution || [],
    statusDistribution: data?.statusDistribution || []
  };
};
