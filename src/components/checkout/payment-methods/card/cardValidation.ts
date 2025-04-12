
import * as z from 'zod';
import { isExpiryDateValid } from '@/utils/cardValidationUtils';
import { requiresFourDigitCvv } from './CardBrandDetector';

// Card validation schema
export const cardSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.string().min(13, 'Número inválido').max(19, 'Número inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  expiryDate: z.string()
    .refine(
      (val) => isExpiryDateValid(val),
      'Data de validade inválida ou cartão vencido'
    ),
  cvv: z.string()
    .refine(
      (val, ctx) => {
        // TypeScript doesn't correctly infer the type of ctx, 
        // so we need to handle this refine case more explicitly
        const context = ctx as z.RefinementCtx;
        const path = context.path;

        // Make sure we're validating the cvv field and parent has a number property
        if (
          Array.isArray(path) && 
          path[0] === 'cvv' && 
          typeof context.data === 'object' && 
          context.data !== null && 
          'number' in context.data
        ) {
          const cardNumber = String(context.data.number || '');
          const isFourDigits = requiresFourDigitCvv(cardNumber);
          
          if (isFourDigits) {
            return /^\d{4}$/.test(val);
          } else {
            return /^\d{3}$/.test(val);
          }
        }
        
        // Default to basic validation if context is not as expected
        return /^\d{3,4}$/.test(val);
      },
      (ctx) => {
        // Same type safety approach for the error message
        const context = ctx as z.RefinementCtx;
        const path = context.path;
        
        if (
          Array.isArray(path) && 
          path[0] === 'cvv' && 
          typeof context.data === 'object' && 
          context.data !== null && 
          'number' in context.data
        ) {
          const cardNumber = String(context.data.number || '');
          const isFourDigits = requiresFourDigitCvv(cardNumber);
          
          if (isFourDigits) {
            return { message: 'CVV deve ter 4 dígitos para este cartão' };
          } else {
            return { message: 'CVV deve ter 3 dígitos' };
          }
        }
        
        return { message: 'CVV inválido' };
      }
    )
});
