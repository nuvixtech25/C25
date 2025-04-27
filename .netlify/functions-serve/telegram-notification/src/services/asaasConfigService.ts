
import { supabase } from '@/integrations/supabase/client';
import { getActiveApiKey } from './asaasKeyService';

export interface AsaasConfigData {
  id?: number;
  sandbox: boolean;
  active: boolean;
  pix_enabled: boolean | null;
  card_enabled: boolean | null;
  active_key_id?: number | null;
  use_netlify_functions?: boolean | null;
  manual_card_redirect_page?: string | null;
  updated_at?: string | null;
  sandbox_key?: string | null;
  production_key?: string | null;
}

export async function getAsaasConfig(): Promise<AsaasConfigData | null> {
  try {
    const { data, error } = await supabase
      .from('asaas_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching Asaas config:', error);
      throw error;
    }

    // Get the active API key based on sandbox mode
    if (data) {
      const activeKey = await getActiveApiKey(data.sandbox);
      if (activeKey) {
        data.active_key_id = activeKey.id;
      }
    }

    return data as AsaasConfigData | null;
  } catch (error) {
    console.error('Error in getAsaasConfig:', error);
    throw error;
  }
}

export async function updateAsaasConfig(config: Partial<AsaasConfigData>): Promise<AsaasConfigData> {
  // Get the existing record ID if available
  const existingConfig = await getAsaasConfig();
  const id = existingConfig?.id;

  try {
    let result;
    const updateData = {
      ...config,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      // Update existing record
      const { data, error } = await supabase
        .from('asaas_config')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new record if none exists
      const { data, error } = await supabase
        .from('asaas_config')
        .insert(updateData)
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    }

    return result as AsaasConfigData;
  } catch (error) {
    console.error('Error updating Asaas config:', error);
    throw error;
  }
}
