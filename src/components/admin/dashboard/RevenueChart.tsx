
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface OrderTimeData {
  date: string;
  orders: number;
  revenue: number;
  pix: number;
  creditCard: number;
  completed: number;
  pending: number;
}

interface RevenueChartProps {
  data: Array<OrderTimeData | any>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  // Safely cast the data to ensure it matches the expected structure
  const chartData = Array.isArray(data) ? data : [];
  
  // Reverse the data to show oldest to newest
  const sortedChartData = [...chartData].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Add custom formatter for date display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
  };
  
  // Add formatter for currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
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
              data={sortedChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                minTickGap={30}
              />
              <YAxis 
                tickFormatter={(value) => `R$${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip
                formatter={(value: any) => [formatCurrency(value), "Receita"]}
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
  );
};

export default RevenueChart;
