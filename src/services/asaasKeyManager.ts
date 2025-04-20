
import { supabase } from '@/integrations/supabase/client';
import { keyTracker, trackKeyUsage, trackKeyError } from '@/config/asaas';

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

/**
 * Obtém a chave API ativa atual para o ambiente especificado
 */
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
      // Se a chave não corresponde ao ambiente, continuamos a buscar outra
    }
    
    // Caso contrário, buscamos a chave ativa de maior prioridade para o ambiente
    const { data, error } = await supabase
      .from('asaas_api_keys')
      .select('*')
      .eq('is_sandbox', isSandbox)
      .eq('is_active', true)
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

/**
 * Obtém a próxima chave de API ativa em caso de falha
 */
export const getNextApiKey = async (currentKeyId: number, isSandbox: boolean): Promise<AsaasApiKey | null> => {
  try {
    // Registra o uso da chave atual no rastreador
    trackKeyUsage(currentKeyId, keyTracker);
    
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
  } catch (error) {
    console.error('Error getting next API key:', error);
    trackKeyError(currentKeyId, error.message || 'Erro desconhecido', keyTracker);
    return null;
  }
};

/**
 * Atualiza a chave API ativa
 */
export const updateActiveKey = async (keyId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('asaas_config')
      .update({ active_key_id: keyId })
      .eq('id', 1); // Assuming we always have one config row
      
    if (error) throw error;
    
    console.log(`Chave ativa atualizada para ID: ${keyId}`);
  } catch (error) {
    console.error('Error updating active key:', error);
    throw error;
  }
};

/**
 * Adiciona uma nova chave API
 */
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

/**
 * Lista todas as chaves API
 */
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

/**
 * Alterna o status de uma chave
 */
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

/**
 * Obtém estatísticas de uso das chaves
 */
export const getKeyStatistics = (): Record<number, unknown> => {
  return keyTracker;
};
