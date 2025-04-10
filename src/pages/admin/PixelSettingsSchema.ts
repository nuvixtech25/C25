
import * as z from 'zod';
import { PixelConfig } from '@/services/pixelConfigService';

// Schema for form validation
export const pixelConfigSchema = z.object({
  id: z.number().optional(),
  googleAdsId: z.string().min(3, 'ID do Google Ads é obrigatório'),
  facebookPixelId: z.string().min(3, 'ID do Facebook Pixel é obrigatório'),
  enabled: z.boolean().default(false),
});

export type PixelConfigFormValues = z.infer<typeof pixelConfigSchema>;
