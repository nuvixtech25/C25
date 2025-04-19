
import { supabase } from '@/integrations/supabase/client';

interface AsaasApiKey {
  id: number;
  key_name: string;
  api_key: string;
  is_sandbox: boolean;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export const getActiveApiKey = async (isSandbox: boolean): Promise<AsaasApiKey | null> => {
  try {
    const { data: config, error: configError } = await supabase
      .from('asaas_config')
      .select('active_key_id')
      .maybeSingle();
      
    if (configError) throw configError;
    
    const { data, error } = await supabase
      .from('asaas_api_keys')
      .select('*')
      .eq('is_sandbox', isSandbox)
      .eq('is_active', true)
      .order('priority')
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching active API key:', error);
    return null;
  }
};

export const getNextApiKey = async (currentKeyId: number, isSandbox: boolean): Promise<AsaasApiKey | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_next_active_key', { 
        current_key_id: currentKeyId, 
        is_sandbox_mode: isSandbox 
      });
      
    if (error) throw error;
    
    if (!data) return null;
    
    // Fetch the complete key data
    const { data: keyData, error: keyError } = await supabase
      .from('asaas_api_keys')
      .select('*')
      .eq('id', data)
      .single();
      
    if (keyError) throw keyError;
    return keyData;
  } catch (error) {
    console.error('Error getting next API key:', error);
    return null;
  }
};

export const updateActiveKey = async (keyId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('asaas_config')
      .update({ active_key_id: keyId })
      .eq('id', 1); // Assuming we always have one config row
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating active key:', error);
    throw error;
  }
};

export const addApiKey = async (
  keyName: string, 
  apiKey: string, 
  isSandbox: boolean,
  priority: number
): Promise<AsaasApiKey | null> => {
  try {
    const { data, error } = await supabase
      .from('asaas_api_keys')
      .insert([{ 
        key_name: keyName,
        api_key: apiKey,
        is_sandbox: isSandbox,
        priority: priority,
        is_active: true // Set is_active to true by default
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding API key:', error);
    return null;
  }
};

export const listApiKeys = async (isSandbox: boolean | null = null): Promise<AsaasApiKey[]> => {
  try {
    let query = supabase
      .from('asaas_api_keys')
      .select('*');
      
    // Only filter by sandbox if the parameter is explicitly provided
    if (isSandbox !== null) {
      query = query.eq('is_sandbox', isSandbox);
    }
    
    query = query.order('priority');
    
    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error listing API keys:', error);
    return [];
  }
};

export const toggleKeyStatus = async (keyId: number, isActive: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('asaas_api_keys')
      .update({ is_active: isActive })
      .eq('id', keyId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error toggling key status:', error);
    throw error;
  }
};
