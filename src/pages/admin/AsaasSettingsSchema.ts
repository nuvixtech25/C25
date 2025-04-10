
import { z } from 'zod';

export const asaasSettingsSchema = z.object({
  sandbox: z.boolean().default(true),
  sandbox_key: z.string().min(1, 'A chave Sandbox é obrigatória'),
  production_key: z.string().optional(),
  pix_enabled: z.boolean().default(false),
  card_enabled: z.boolean().default(false),
  active: z.boolean().default(false),
  // New field for Netlify functions toggle
  use_netlify_functions: z.boolean().default(false),
});

export type AsaasSettingsFormValues = z.infer<typeof asaasSettingsSchema>;
