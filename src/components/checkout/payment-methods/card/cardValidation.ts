
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
      (val: string, ctx: z.RefinementCtx) => {
        // Get card number from form data
        const cardNumber = Array.isArray(ctx.path) && ctx.path.length > 0 && ctx.path[0] === 'cvv' && 
          typeof ctx.data === 'object' && ctx.data !== null && 'number' in ctx.data
            ? String(ctx.data.number || '')
            : '';
        
        // Check if card requires a 4-digit CVV (like Amex)
        const isFourDigits = requiresFourDigitCvv(cardNumber);
        
        // Validate based on card type
        if (isFourDigits) {
          return /^\d{4}$/.test(val);
        } else {
          return /^\d{3}$/.test(val);
        }
      },
      {
        message: (ctx: z.RefinementCtx) => {
          // Get card number from form data
          const cardNumber = Array.isArray(ctx.path) && ctx.path.length > 0 && ctx.path[0] === 'cvv' && 
            typeof ctx.data === 'object' && ctx.data !== null && 'number' in ctx.data
              ? String(ctx.data.number || '')
              : '';
          
          // Provide appropriate error message based on card type
          const isFourDigits = requiresFourDigitCvv(cardNumber);
          
          if (isFourDigits) {
            return 'CVV deve ter 4 dígitos para este cartão';
          } else {
            return 'CVV deve ter 3 dígitos';
          }
        }
      }
    )
});
