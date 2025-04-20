
import { Handler, HandlerEvent } from '@netlify/functions';
import { supabase } from './asaas/supabase-client';
import { AsaasCustomerRequest } from './asaas/types';
import { validateAsaasCustomerRequest } from './asaas/validation';
import { processPaymentFlow } from './asaas/payment-processor';
import { AsaasApiKey, getActiveApiKey, listApiKeys } from '../src/services/asaasKeyManager';

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const requestData: AsaasCustomerRequest = JSON.parse(event.body || '{}');
    console.log('Solicitação recebida:', requestData);

    // Validation
    const validationError = validateAsaasCustomerRequest(requestData);
    if (validationError) {
      console.error('Erro de validação:', validationError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError }),
      };
    }

    // Determine environment
    const useProduction = process.env.USE_ASAAS_PRODUCTION === 'true';
    const isSandbox = !useProduction;
    const apiBaseUrl = isSandbox 
      ? 'https://sandbox.asaas.com/api/v3' 
      : 'https://api.asaas.com/v3';
      
    console.log(`Ambiente: ${isSandbox ? 'Sandbox' : 'Produção'}`);
    
    // Obter a chave ativa e chaves de fallback
    const activeKey = await getActiveApiKey(isSandbox);
    if (!activeKey) {
      console.error(`Nenhuma chave ${isSandbox ? 'sandbox' : 'produção'} ativa encontrada`);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }
    
    // Obter as chaves de fallback (todas as chaves ativas exceto a principal)
    const allKeys = await listApiKeys(isSandbox);
    const fallbackKeysData = allKeys
      .filter(k => k.is_active && k.id !== activeKey.id)
      .map(k => ({
        id: k.id,
        key: k.api_key,
        name: k.key_name
      }));
    
    console.log(`Usando chave principal: ${activeKey.key_name} (ID: ${activeKey.id})`);
    console.log(`Chaves de fallback disponíveis: ${fallbackKeysData.length}`);

    // Process payment with active key and fallback mechanism
    const result = await processPaymentFlow(
      requestData,
      activeKey.api_key,
      supabase,
      apiBaseUrl,
      fallbackKeysData
    );
    
    // Log the used key information
    const usedKeyId = result.usedKey || activeKey.id;
    const usedKeyName = usedKeyId === activeKey.id
      ? activeKey.key_name
      : fallbackKeysData.find(k => k.id === usedKeyId)?.name || 'Desconhecida';
    
    console.log(`Pagamento processado com sucesso usando chave: ${usedKeyName} (ID: ${usedKeyId})`);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Erro no processamento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Falha no processamento do pagamento',
        details: error.message
      }),
    };
  }
};

export { handler };
