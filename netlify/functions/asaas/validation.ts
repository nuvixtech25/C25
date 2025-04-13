
export function validateEnvironmentVariables() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Verificar variáveis Supabase
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variáveis de ambiente do Supabase não configuradas corretamente');
    throw new Error('Credenciais do Supabase não configuradas');
  }
  
  // Obter configuração do Asaas do banco de dados
  // Esta lógica será implementada na função principal
  // para permitir a recuperação dinâmica da chave

  return {
    supabaseUrl,
    supabaseServiceKey,
    asaasApiKey: 'A chave será obtida dinamicamente'
  };
}

export function parseAndValidateRequestData(event: any) {
  if (!event.body) {
    throw new Error('Corpo da requisição não fornecido');
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Dados recebidos:', {
      name: data.name || data.customer?.name,
      email: data.email || data.customer?.email,
      hasCpfCnpj: !!(data.cpfCnpj || data.customer?.cpfCnpj),
      hasPhone: !!(data.phone || data.customer?.phone),
      hasOrderId: !!data.orderId,
      hasValue: !!data.value,
      valueType: typeof data.value
    });

    // Validações básicas
    if (!data.name && !data.customer?.name) {
      throw new Error('Nome não fornecido');
    }
    
    if (!data.cpfCnpj && !data.customer?.cpfCnpj) {
      throw new Error('CPF/CNPJ não fornecido');
    }
    
    if (!data.orderId) {
      throw new Error('ID do pedido não fornecido');
    }
    
    if (!data.value && data.value !== 0) {
      throw new Error('Valor não fornecido');
    }
    
    // Normalizar estrutura dos dados
    return {
      name: data.name || data.customer?.name,
      cpfCnpj: data.cpfCnpj || data.customer?.cpfCnpj,
      email: data.email || data.customer?.email || '',
      phone: data.phone || data.customer?.phone || '',
      orderId: data.orderId,
      value: typeof data.value === 'string' ? parseFloat(data.value) : data.value,
      description: data.description || `Pedido #${data.orderId}`
    };
  } catch (error) {
    console.error('Erro ao validar dados:', error);
    throw new Error(`Dados inválidos: ${error.message || 'formato JSON inválido'}`);
  }
}

export function createErrorResponse(statusCode: number, message: string, stack?: string) {
  const response = {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message, ...(stack ? { stack } : {}) })
  };
  
  console.error(`Enviando resposta de erro: ${statusCode} - ${message}`);
  return response;
}
