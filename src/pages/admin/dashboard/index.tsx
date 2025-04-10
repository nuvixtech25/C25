
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import AdminLayout from '@/layouts/AdminLayout';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { PaymentStatus } from '@/types/checkout';

// Dashboard statistic card component
const StatCard = ({ title, value, description, icon, className = "" }) => {
  const Icon = icon;
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Dashboard main page component
const DashboardPage = () => {
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
  
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          
          <div className="flex items-center gap-2">
            <Tabs
              defaultValue="7days"
              value={period}
              onValueChange={(value) => setPeriod(value as any)}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="today">Hoje</TabsTrigger>
                <TabsTrigger value="7days">7 dias</TabsTrigger>
                <TabsTrigger value="30days">30 dias</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Pedidos Totais" 
            value={statsLoading ? "..." : stats?.totalOrders}
            description={`No período selecionado`}
            icon={ShoppingCart}
          />
          <StatCard 
            title="Faturamento" 
            value={statsLoading ? "..." : `R$ ${stats?.totalRevenue.toFixed(2)}`}
            description={`Receita no período selecionado`}
            icon={DollarSign}
          />
          <StatCard 
            title="Cartões Capturados" 
            value={statsLoading ? "..." : stats?.cardsCaptures}
            description={`No período selecionado`}
            icon={CreditCard}
          />
          <StatCard 
            title="Visitantes" 
            value={statsLoading ? "..." : stats?.visitors}
            description={`Estimativa no período selecionado`}
            icon={Users}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Pedidos ao longo do tempo</CardTitle>
              <CardDescription>
                Número de pedidos no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={{
                orders: { color: "#6E59A5" },
                revenue: { color: "#10B981" }
              }}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={ordersOverTime || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6E59A5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#6E59A5"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                      name="Pedidos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Distribuição de pedidos por método de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                pix: { color: "#10B981" },
                creditCard: { color: "#8B5CF6" }
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>
                Receita ao longo do período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={{
                revenue: { color: "#10B981" }
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={ordersOverTime || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip
                      formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]}
                      content={<ChartTooltipContent />}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Receita"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status dos Pedidos</CardTitle>
              <CardDescription>
                Distribuição de pedidos por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                pending: { color: "#F59E0B" },
                completed: { color: "#10B981" },
                cancelled: { color: "#EF4444" },
                refunded: { color: "#6B7280" },
                overdue: { color: "#EC4899" }
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusDistribution || []}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Quantidade">
                      {statusDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
