
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { validateEnvironmentVariables, parseAndValidateRequestData, createErrorResponse } from './asaas/validation';
import { processPaymentFlow } from './asaas/payment-processor';

export const handler: Handler = async (event) => {
  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return createErrorResponse(405, 'Método não permitido. Use POST.');
    }

    // Validate environment variables
    const { supabaseUrl, supabaseServiceKey, asaasApiKey } = validateEnvironmentVariables();

    // Initialize Supabase client
    console.log('Inicializando cliente Supabase...');
    console.log(`URL Supabase: ${supabaseUrl.substring(0, 10)}...`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate request data
    const requestData = parseAndValidateRequestData(event);
    console.log('Dados recebidos:', requestData);

    // Main process flow
    const result = await processPaymentFlow(requestData, asaasApiKey, supabase);

    // Return successful response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Erro na função:', error);
    
    // Create appropriate error response
    return createErrorResponse(
      error instanceof Error && error.name === 'ConfigurationError' ? 400 : 500,
      error.message || 'Erro interno no servidor',
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }
};
