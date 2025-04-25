
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/services/dashboard/dashboardService';
import { toast } from '@/components/ui/use-toast';

export const useDashboardData = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [error, setError] = useState<Error | null>(null);

  const queryResult = useQuery({
    queryKey: ['dashboardData', period],
    queryFn: () => {
      console.log('Fetching dashboard data for period:', period);
      return fetchDashboardData(period);
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
  
  const { data, isLoading, error: queryError } = queryResult;
  
  useEffect(() => {
    if (queryError) {
      console.error('Error fetching dashboard data:', queryError);
      setError(queryError as Error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    } else {
      setError(null);
    }
  }, [queryError]);
  
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
    statusDistribution: data?.statusDistribution || [],
    error: error || queryError
  };
};
