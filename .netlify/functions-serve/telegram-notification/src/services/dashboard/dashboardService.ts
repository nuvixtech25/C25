
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import { 
  getDateRangeByPeriod, 
  createDateDataPoints 
} from '@/utils/dashboard/dateUtils';
import { 
  processOrdersTimeData, 
  prepareDistributionChartData,
  getStatusColorMap,
  getPaymentMethodColorMap,
  transformTimeSeriesData
} from '@/utils/dashboard/dataTransformUtils';

export interface DashboardData {
  totalOrders: number;
  totalRevenue: string;
  totalRevenueRaw: number;
  confirmedOrders: number;
  confirmedRevenue: string;
  confirmedRevenueRaw: number;
  conversionRate: string;
  todayOrders: number;
  todayRevenue: string;
  thisMonthOrders: number;
  thisMonthRevenue: string;
  statusDistribution: { name: string; value: number; color: string }[];
  paymentDistribution: { name: string; value: number; color: string }[];
  ordersOverTime: any[];
  last7DaysOrders: any[];
  last7DaysRevenue: any[];
  ordersRaw: any[];
}

/**
 * Fetches all dashboard data from Supabase
 */
export const fetchDashboardData = async (period: 'today' | '7days' | '30days' | 'all'): Promise<DashboardData> => {
  const dateRanges = getDateRangeByPeriod(period);
  
  // Prepare query
  let query = supabase.from('orders').select('*');
  
  // Apply date filters based on period
  if (period === 'today') {
    query = query
      .gte('created_at', dateRanges.today.start)
      .lte('created_at', dateRanges.today.end);
  } else if (period === '7days') {
    query = query
      .gte('created_at', dateRanges.last7Days.start)
      .lte('created_at', dateRanges.last7Days.end);
  } else if (period === '30days') {
    query = query
      .gte('created_at', dateRanges.last30Days.start)
      .lte('created_at', dateRanges.last30Days.end);
  }
  // 'all' period doesn't add any date filters
  
  // Execute the query
  const { data: orders, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch dashboard data');
  }

  // Calculate key metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.product_price), 0);
  const confirmedOrders = orders.filter(order => order.status === 'CONFIRMED');
  const totalConfirmedRevenue = confirmedOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
  
  // Get all orders (unfiltered) for today and this month metrics
  const { data: allOrders } = await supabase.from('orders').select('*');
  
  // Calculate today's metrics
  const todayOrders = (allOrders || []).filter(order => 
    new Date(order.created_at) >= new Date(dateRanges.today.start) && 
    new Date(order.created_at) <= new Date(dateRanges.today.end)
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.product_price), 0);
  
  // Calculate this month's metrics
  const thisMonthOrders = (allOrders || []).filter(order => 
    new Date(order.created_at) >= new Date(dateRanges.month.start) && 
    new Date(order.created_at) <= new Date(dateRanges.month.end)
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
  
  // Prepare time series data based on selected period
  let dateDataPoints;
  let processedDateData;
  
  if (period === 'today') {
    // Use hourly data for today
    dateDataPoints = {}; // Implement hourly data if needed
    processedDateData = {}; // Implement hourly data if needed
  } else if (period === '7days') {
    dateDataPoints = createDateDataPoints(7);
    processedDateData = processOrdersTimeData(
      orders, 
      dateDataPoints, 
      dateRanges.last7Days.start
    );
  } else if (period === '30days') {
    dateDataPoints = createDateDataPoints(30);
    processedDateData = processOrdersTimeData(
      orders, 
      dateDataPoints, 
      dateRanges.last30Days.start
    );
  } else {
    // All time data, can be expensive for large datasets
    // For simplicity, show the last 30 days even for "all" selection
    dateDataPoints = createDateDataPoints(30);
    processedDateData = processOrdersTimeData(
      orders, 
      dateDataPoints, 
      dateRanges.last30Days.start
    );
  }

  // Prepare chart data
  const statusDistribution = prepareDistributionChartData(statusCounts, getStatusColorMap());
  const paymentDistribution = prepareDistributionChartData(paymentMethodCounts, getPaymentMethodColorMap());
  
  // Transform time series data for charts
  const ordersOverTime = transformTimeSeriesData(processedDateData, 'orders');
  const revenueOverTime = transformTimeSeriesData(processedDateData, 'revenue');
  
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
    ordersOverTime: ordersOverTime,
    last7DaysOrders: ordersOverTime,
    last7DaysRevenue: revenueOverTime,
    ordersRaw: orders
  };
};
