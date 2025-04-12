
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuração da API Asaas
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';

export const handler: Handler = async (event) => {
  // Verificar se o método é GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método não permitido. Use GET.' }),
    };
  }

  // Obter o ID do pagamento da query string
  const paymentId = event.queryStringParameters?.paymentId;
  
  if (!paymentId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'ID do pagamento não fornecido.' }),
    };
  }

  try {
    // Consultar o status do pagamento no Asaas
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(`Erro ao consultar pagamento no Asaas: ${JSON.stringify(errorData)}`);
    }
    
    const paymentData = await response.json();
    const status = paymentData.status;
    
    console.log(`Payment status from Asaas API: ${status} for payment ${paymentId}`);
    
    // Atualizar o status do pagamento no Supabase
    const { data: asaasPayment, error: findError } = await supabase
      .from('asaas_payments')
      .select('order_id')
      .eq('payment_id', paymentId)
      .single();
    
    if (findError) {
      console.error('Erro ao buscar pagamento no Supabase:', findError);
    } else if (asaasPayment) {
      // Atualizar o status na tabela asaas_payments
      const { error: updatePaymentError } = await supabase
        .from('asaas_payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('payment_id', paymentId);
      
      if (updatePaymentError) {
        console.error('Erro ao atualizar status do pagamento:', updatePaymentError);
      } else {
        console.log(`Updated asaas_payments status to ${status}`);
      }
      
      // Atualizar o status na tabela orders
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', asaasPayment.order_id);
      
      if (updateOrderError) {
        console.error('Erro ao atualizar status do pedido:', updateOrderError);
      } else {
        console.log(`Updated orders status to ${status} for order ${asaasPayment.order_id}`);
      }
    }
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        paymentId,
        status,
        updatedAt: new Date().toISOString()
      }),
    };
    
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Erro interno no servidor' }),
    };
  }
};
