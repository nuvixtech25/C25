
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PaymentStatus } from '@/types/checkout';

export const useWebhookData = (statusFilter: PaymentStatus | 'ALL') => {
  // Fetch all orders with filtering
  return useQuery({
    queryKey: ['webhook-orders', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if not set to ALL
      if (statusFilter !== 'ALL') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
};
