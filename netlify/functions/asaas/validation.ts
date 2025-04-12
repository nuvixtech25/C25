
import { ConfigurationError } from './types';
import { AsaasCustomerRequest } from './types';

export function validateEnvironmentVariables() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const asaasApiKey = process.env.ASAAS_API_KEY;
  
  // Check for missing environment variables
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!asaasApiKey) missingVars.push('ASAAS_API_KEY');
  
  if (missingVars.length > 0) {
    throw new ConfigurationError(`Configuração incompleta. Faltam variáveis de ambiente: ${missingVars.join(', ')}`);
  }
  
  return { supabaseUrl, supabaseServiceKey, asaasApiKey };
}

export function parseAndValidateRequestData(event: any): AsaasCustomerRequest {
  try {
    const requestData = JSON.parse(event.body || '{}') as AsaasCustomerRequest;
    
    // Check for required fields
    const requiredFields = ['name', 'cpfCnpj', 'email', 'phone', 'orderId', 'value'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      throw new ConfigurationError(`Dados incompletos. Campos obrigatórios: ${missingFields.join(', ')}`);
    }
    
    return requestData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigurationError('Formato de JSON inválido na requisição');
    }
    throw error;
  }
}

export function createErrorResponse(statusCode: number, message: string, stack?: string) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      error: message,
      stack: stack
    }),
  };
}
