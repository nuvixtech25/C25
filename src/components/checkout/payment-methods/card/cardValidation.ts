
import * as z from 'zod';
import { isExpiryDateValid } from '@/utils/cardValidationUtils';

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
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido')
});
