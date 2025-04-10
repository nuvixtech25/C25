
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle } from 'lucide-react';

interface AttemptStats {
  attemptNumber: number;
  count: number;
  successCount: number;
  successRate: number;
}

interface BrandStats {
  brand: string;
  count: number;
  value: number;
}

const PaymentRetryAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [attemptStats, setAttemptStats] = useState<AttemptStats[]>([]);
  const [brandStats, setBrandStats] = useState<BrandStats[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageAttempts, setAverageAttempts] = useState(0);
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Fetch all card data
        const { data: cardData, error: cardError } = await supabase
          .from('card_data')
          .select('*, orders!fk_card_order(*)');

        if (cardError) throw cardError;

        if (!cardData) {
          setAttemptStats([]);
          setBrandStats([]);
          setLoading(false);
          return;
        }

        // Calculate total attempts and orders
        setTotalAttempts(cardData.length);

        // Get unique order IDs to calculate total orders
        const uniqueOrderIds = new Set();
        cardData.forEach(card => {
          if (card.order_id) uniqueOrderIds.add(card.order_id);
        });
        setTotalOrders(uniqueOrderIds.size);

        // Calculate average attempts per order
        setAverageAttempts(uniqueOrderIds.size > 0 ? cardData.length / uniqueOrderIds.size : 0);

        // Process card data to get attempt statistics
        const attemptsMap = new Map<string, { attempts: number; status: string }>();

        // First pass: count attempts per order
        cardData.forEach(card => {
          const orderId = card.order_id;
          if (!orderId) return;

          if (!attemptsMap.has(orderId)) {
            attemptsMap.set(orderId, { attempts: 1, status: card.orders?.status || 'PENDING' });
          } else {
            const current = attemptsMap.get(orderId)!;
            attemptsMap.set(orderId, { 
              attempts: current.attempts + 1,
              status: card.orders?.status || current.status
            });
          }
        });

        // Calculate attempt stats
        const attemptCounts: { [key: number]: { total: number; success: number } } = {};
        
        attemptsMap.forEach(({ attempts, status }) => {
          if (!attemptCounts[attempts]) {
            attemptCounts[attempts] = { total: 0, success: 0 };
          }
          
          attemptCounts[attempts].total++;
          
          if (status === 'CONFIRMED' || status === 'RECEIVED') {
            attemptCounts[attempts].success++;
          }
        });

        // Convert to array format for the chart
        const attemptStatsArray: AttemptStats[] = [];
        for (const [attempt, counts] of Object.entries(attemptCounts)) {
          attemptStatsArray.push({
            attemptNumber: parseInt(attempt, 10),
            count: counts.total,
            successCount: counts.success,
            successRate: counts.total > 0 ? (counts.success / counts.total) * 100 : 0
          });
        }

        // Sort by attempt number
        attemptStatsArray.sort((a, b) => a.attemptNumber - b.attemptNumber);
        setAttemptStats(attemptStatsArray);

        // Process brand statistics
        const brandMap = new Map<string, { count: number; value: number }>();
        
        cardData.forEach(card => {
          const brand = card.brand || 'Unknown';
          const value = card.orders?.product_price || 0;
          
          if (!brandMap.has(brand)) {
            brandMap.set(brand, { count: 1, value });
          } else {
            const current = brandMap.get(brand)!;
            brandMap.set(brand, { 
              count: current.count + 1,
              value: current.value + value
            });
          }
        });

        // Convert to array format for the chart
        const brandStatsArray: BrandStats[] = [];
        brandMap.forEach((stats, brand) => {
          brandStatsArray.push({
            brand,
            count: stats.count,
            value: stats.value
          });
        });

        // Sort by count
        brandStatsArray.sort((a, b) => b.count - a.count);
        setBrandStats(brandStatsArray);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados de análise',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Carregando dados de análise..." />
      </div>
    );
  }

  if (attemptStats.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Análise de Retry Payment</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Dados insuficientes</CardTitle>
            <CardDescription>
              Não há dados suficientes para gerar análises de tentativas de pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p>Nenhuma tentativa de pagamento registrada ainda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Análise de Retry Payment</h1>
      <p className="text-muted-foreground">
        Visualize e analise as tentativas de pagamento e conversões.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Todas as tentativas de pagamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pedidos com pelo menos uma tentativa</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média de Tentativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttempts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Média de tentativas por pedido</p>
          </CardContent>
        </Card>
      </div>

      {/* Attempt Count Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tentativas</CardTitle>
          <CardDescription>
            Número de pedidos por quantidade de tentativas e taxa de sucesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attemptStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attemptNumber" label={{ value: 'Número de Tentativas', position: 'insideBottom', offset: -5 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Taxa de Sucesso (%)', angle: -90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Quantidade de Pedidos" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="successRate" name="Taxa de Sucesso (%)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Brand Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Bandeira</CardTitle>
          <CardDescription>
            Quantidade de tentativas por bandeira de cartão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="brand"
                >
                  {brandStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRetryAnalytics;
