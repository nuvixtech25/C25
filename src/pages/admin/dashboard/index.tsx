
import React, { useEffect } from 'react';
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import OrdersTimeChart from '@/components/admin/dashboard/OrdersTimeChart';
import PaymentMethodsChart from '@/components/admin/dashboard/PaymentMethodsChart';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart';
import ActiveVisitorsCard from '@/components/admin/dashboard/ActiveVisitorsCard';
import PaymentMethodCountCard from '@/components/admin/dashboard/PaymentMethodCountCard';
import { LoadingState } from '@/components/shared/LoadingState';

const DashboardPage = () => {
  useEffect(() => {
    console.log('Dashboard component mounted');
  }, []);

  const {
    period,
    setPeriod,
    stats,
    statsLoading,
    ordersOverTime,
    paymentDistribution,
    statusDistribution
  } = useDashboardData();

  console.log('Dashboard data:', { 
    stats, 
    ordersOverTime: ordersOverTime?.length, 
    paymentDistribution: paymentDistribution?.length
  });

  // Extract specific payment method counts
  const pixOrdersCount = paymentDistribution?.find(p => p.name === 'pix')?.value || 0;
  const cardOrdersCount = paymentDistribution?.find(p => p.name === 'creditCard')?.value || 0;
  
  if (statsLoading) {
    return <LoadingState message="Carregando dados do dashboard..." />;
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <DashboardHeader 
        period={period}
        setPeriod={setPeriod}
      />
      
      <DashboardStats 
        stats={stats}
        loading={statsLoading}
        period={period}
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ActiveVisitorsCard />
        <PaymentMethodCountCard 
          title="Pedidos PIX" 
          count={pixOrdersCount}
          type="pix"
          description="Total no período selecionado" 
        />
        <PaymentMethodCountCard 
          title="Pedidos Cartão" 
          count={cardOrdersCount}
          type="creditCard"
          description="Total no período selecionado" 
        />
      </div>
      
      {ordersOverTime && ordersOverTime.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <OrdersTimeChart data={ordersOverTime} />
            <PaymentMethodsChart data={paymentDistribution || []} />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RevenueChart data={ordersOverTime} />
            <OrderStatusChart data={statusDistribution || []} />
          </div>
        </>
      ) : (
        <div className="p-6 bg-gray-50 rounded-md text-center">
          <h3 className="text-lg font-medium text-gray-600">Nenhum dado disponível</h3>
          <p className="text-gray-500">Não há dados de pedidos para o período selecionado.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
