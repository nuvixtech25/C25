
import { KeyMetrics } from '@/config/asaas';

export interface AsaasApiKey {
  id: number;
  key_name: string;
  api_key: string;
  is_sandbox: boolean;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface KeyStatistics {
  [keyId: number]: KeyMetrics;
}
