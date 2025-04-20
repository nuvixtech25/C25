
// Configuração centralizada para integração com o Asaas

/**
 * Define o ambiente de execução para as operações da API Asaas
 */
export enum AsaasEnvironment {
  PRODUCTION = 'production',
  SANDBOX = 'sandbox'
}

/**
 * Configuração de URLs da API do Asaas
 */
export const ASAAS_API_URLS = {
  [AsaasEnvironment.PRODUCTION]: 'https://api.asaas.com/v3',
  [AsaasEnvironment.SANDBOX]: 'https://sandbox.asaas.com/api/v3'
};

/**
 * Interface para métricas de uso da chave API
 */
export interface KeyMetrics {
  uses: number;
  lastUsed: Date | null;
  errors: number;
  lastError: Date | null;
  lastErrorMessage: string | null;
}

/**
 * Interface para rastreamento de status e métricas das chaves
 */
export interface ApiKeyTracker {
  [keyId: number]: KeyMetrics;
}

/**
 * Registra o uso de uma chave específica
 */
export const trackKeyUsage = (keyId: number, tracker: ApiKeyTracker): void => {
  if (!tracker[keyId]) {
    tracker[keyId] = {
      uses: 0,
      lastUsed: null,
      errors: 0,
      lastError: null,
      lastErrorMessage: null
    };
  }
  
  tracker[keyId].uses += 1;
  tracker[keyId].lastUsed = new Date();
};

/**
 * Registra erro em uma chave específica
 */
export const trackKeyError = (keyId: number, errorMessage: string, tracker: ApiKeyTracker): void => {
  if (!tracker[keyId]) {
    tracker[keyId] = {
      uses: 0,
      lastUsed: null,
      errors: 0,
      lastError: null,
      lastErrorMessage: null
    };
  }
  
  tracker[keyId].errors += 1;
  tracker[keyId].lastError = new Date();
  tracker[keyId].lastErrorMessage = errorMessage;
};

// Estado global (sem persistência)
export const keyTracker: ApiKeyTracker = {};
