
import * as z from 'zod';
import { isExpiryDateValid } from '@/utils/cardValidationUtils';
import { requiresFourDigitCvv } from './CardBrandDetector';

// Use superRefine instead of refine for more complex validations where we need context data
export const cardSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  number: z.string().min(13, 'Número inválido').max(19, 'Número inválido')
    .regex(/^\d+$/, 'Apenas números são permitidos'),
  expiryDate: z.string()
    .refine(
      (val) => isExpiryDateValid(val),
      'Data de validade inválida ou cartão vencido'
    ),
  // Use superRefine instead of refine to access other field values
  cvv: z.string()
}).superRefine((data, ctx) => {
  // Get the CVV value
  const cvv = data.cvv;
  
  // Get card number from form data
  const cardNumber = data.number || '';
  
  // Check if card requires a 4-digit CVV (like Amex)
  const isFourDigits = requiresFourDigitCvv(cardNumber);
  
  // Validate based on card type
  let isValid: boolean;
  if (isFourDigits) {
    isValid = /^\d{4}$/.test(cvv);
  } else {
    isValid = /^\d{3}$/.test(cvv);
  }

  // If invalid, add an issue
  if (!isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: isFourDigits 
        ? 'CVV deve ter 4 dígitos para este cartão'
        : 'CVV deve ter 3 dígitos',
      path: ['cvv'],
    });
  }
});
