
import { useState } from 'react';
import { useRetryValidator } from '@/hooks/useRetryValidator';

/**
 * Hook that combines validation logics for retry attempts
 * Slimmed down version of the original useRetryValidation.ts that now uses useRetryValidator
 */
export const useRetryValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { checkRetryLimit, canAttemptNow, isValidating: validatorIsValidating } = useRetryValidator();

  /**
   * Função de validação completa que verifica tanto o limite quanto o intervalo
   */
  const validateRetryAttempt = async (
    orderId: string,
    options = { maxAttempts: 3, minMinutes: 5, enforceDelay: false }
  ): Promise<{ 
    canProceed: boolean; 
    message?: string; 
    remainingAttempts?: number;
    waitTime?: number;
  }> => {
    setIsValidating(true);
    
    try {
      // Verifica o limite de tentativas
      const limitCheck = await checkRetryLimit(orderId, options.maxAttempts);
      
      if (!limitCheck.valid) {
        return {
          canProceed: false,
          message: limitCheck.message,
          remainingAttempts: 0
        };
      }
      
      // Verifica o intervalo entre tentativas (se enforceDelay for true)
      if (options.enforceDelay) {
        const delayCheck = await canAttemptNow(orderId, options.minMinutes);
        
        if (!delayCheck.allowed) {
          return {
            canProceed: false,
            message: delayCheck.message,
            remainingAttempts: options.maxAttempts - limitCheck.currentAttempts,
            waitTime: delayCheck.waitTime
          };
        }
      }
      
      // Tudo ok, pode prosseguir
      return {
        canProceed: true,
        message: limitCheck.message,
        remainingAttempts: options.maxAttempts - limitCheck.currentAttempts
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating: isValidating || validatorIsValidating,
    validateRetryAttempt
  };
};
