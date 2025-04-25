
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/dashboard/dashboardService';
import { toast } from '@/components/ui/use-toast';
import { handleApiError } from '@/utils/errorHandling';

export const useDashboardData = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [error, setError] = useState<Error | null>(null);

  const queryResult = useQuery({
    queryKey: ['dashboardData', period],
    queryFn: () => {
      console.log('Fetching dashboard data for period:', period);
      try {
        return fetchDashboardData(period);
      } catch (err) {
        console.error('Error in dashboard data fetch function:', err);
        throw err;
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
    retry: 2
  });
  
  const { data, isLoading, error: queryError, refetch } = queryResult;
  
  useEffect(() => {
    if (queryError) {
      console.error('Dashboard data error:', queryError);
      setError(queryError as Error);
      
      // Handle error directly here instead of using meta
      handleApiError(queryError as Error, {
        toast,
        defaultMessage: "Não foi possível carregar os dados do dashboard.",
        logError: true
      });
    } else {
      setError(null);
    }
  }, [queryError]);

  // Log the data received
  useEffect(() => {
    if (data) {
      console.log('Dashboard data received:', {
        totalOrders: data.totalOrders,
        hasOrdersData: Array.isArray(data.ordersOverTime) && data.ordersOverTime.length > 0
      });
    }
  }, [data]);
  
  return {
    period,
    setPeriod,
    stats: {
      totalOrders: data?.totalOrders || 0,
      totalRevenue: data?.totalRevenueRaw || 0,
      cardsCaptures: data?.ordersRaw?.filter(order => order?.payment_method === 'creditCard')?.length || 0,
      visitors: data?.totalOrders ? Math.round(data.totalOrders * 2.5) : 0
    },
    statsLoading: isLoading,
    ordersOverTime: data?.ordersOverTime || [],
    paymentDistribution: data?.paymentDistribution || [],
    statusDistribution: data?.statusDistribution || [],
    error: error || queryError,
    refetch
  };
};
