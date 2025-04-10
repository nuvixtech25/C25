
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Definir tipos para o payload do webhook
interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    status: string;
    value: number;
    dateCreated: string;
    invoiceUrl?: string;
    billingType: string;
    externalReference?: string;
  };
}

export const handler: Handler = async (event) => {
  // Garantir que apenas solicitações POST sejam processadas
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido' }),
    };
  }

  try {
    // Parsear o corpo da requisição
    const payload: AsaasWebhookPayload = JSON.parse(event.body || '{}');
    
    console.log('Webhook recebido do Asaas:', payload);

    // Verificar se o evento é relacionado a pagamento
    if (payload.event && payload.payment) {
      // Atualizar o status do pedido no Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: payload.payment.status,
          updated_at: new Date().toISOString()
        })
        .eq('asaas_payment_id', payload.payment.id);

      if (error) {
        console.error('Erro ao atualizar pedido:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Erro ao processar webhook' }),
        };
      }

      // Registrar o evento do webhook
      await supabase
        .from('asaas_webhook_logs')
        .insert({
          event_type: payload.event,
          payment_id: payload.payment.id,
          status: payload.payment.status,
          payload: payload
        });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processado com sucesso' }),
    };
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' }),
    };
  }
};
