
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
      val => isExpiryDateValid(val),
      'Data de validade inválida ou cartão vencido'
    ),
  cvv: z.string()
    .refine(
      (val, ctx) => {
        const cardNumber = ctx.path[0] === 'cvv' && ctx.parent.number 
          ? ctx.parent.number.toString() 
          : '';
        
        const isFourDigits = requiresFourDigitCvv(cardNumber);
        
        if (isFourDigits) {
          return /^\d{4}$/.test(val);
        } else {
          return /^\d{3}$/.test(val);
        }
      },
      ctx => {
        const cardNumber = ctx.path[0] === 'cvv' && ctx.parent.number 
          ? ctx.parent.number.toString() 
          : '';
        
        const isFourDigits = requiresFourDigitCvv(cardNumber);
        
        if (isFourDigits) {
          return { message: 'CVV deve ter 4 dígitos para este cartão' };
        } else {
          return { message: 'CVV deve ter 3 dígitos' };
        }
      }
    )
});
