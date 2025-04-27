
import { supabase } from '@/integrations/supabase/client';
import { AsaasApiKey } from './types';
import { trackKeyError } from './keyStatisticsService';

export const getActiveApiKey = async (isSandbox: boolean): Promise<AsaasApiKey | null> => {
  try {
    // Primeiro, verificamos se há uma chave explicitamente configurada como ativa
    const { data: config, error: configError } = await supabase
      .from('asaas_config')
      .select('active_key_id')
      .maybeSingle();
      
    if (configError) throw configError;
    
    const activeKeyId = config?.active_key_id;
    
    // Se temos um ID de chave ativa, buscamos essa chave específica
    if (activeKeyId) {
      const { data: activeKey, error: activeKeyError } = await supabase
        .from('asaas_api_keys')
        .select('*')
        .eq('id', activeKeyId)
        .eq('is_sandbox', isSandbox)
        .eq('is_active', true)
        .maybeSingle();
        
      if (!activeKeyError && activeKey) {
        console.log(`Usando chave API ativa (ID: ${activeKey.id}, Nome: ${activeKey.key_name})`);
        return activeKey;
      }
    }
    
    // Caso contrário, buscamos a chave ativa de maior prioridade para o ambiente
    const { data, error } = await supabase
      .from('asaas_api_keys')
      .select('*')
      .eq('is_active', true)
      .eq('is_sandbox', isSandbox)
      .order('priority')
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    
    if (data) {
      console.log(`Usando chave API por prioridade (ID: ${data.id}, Nome: ${data.key_name})`);
    } else {
      console.log(`Nenhuma chave ${isSandbox ? 'sandbox' : 'produção'} ativa encontrada`);
    }
    
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
    
    console.log(`Alternando para próxima chave (ID: ${keyData.id}, Nome: ${keyData.key_name})`);
    return keyData;
  } catch (err) {
    const error = err as Error;
    console.error('Error getting next API key:', error);
    trackKeyError(currentKeyId, error.message || 'Erro desconhecido', {});
    return null;
  }
};

export const updateActiveKey = async (keyId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('asaas_config')
      .update({ active_key_id: keyId })
      .eq('id', 1);
      
    if (error) throw error;
    
    console.log(`Chave ativa atualizada para ID: ${keyId}`);
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
        is_active: true
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
      
    if (isSandbox !== null) {
      query = query.eq('is_sandbox', isSandbox);
    }
    
    query = query.order('priority');
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error in listApiKeys:', error);
      throw error;
    }
    
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
