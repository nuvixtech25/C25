
import * as z from 'zod';
import { PixelConfig } from '@/services/pixelConfigService';

// Schema for form validation
export const pixelConfigSchema = z.object({
  id: z.number().optional(),
  googleAdsId: z.string().optional().default(''),
  conversionLabel: z.string().optional().default(''),
  facebookPixelId: z.string().optional().default(''),
  facebookToken: z.string().optional().default(''),
  googleEnabled: z.boolean().default(false),
  facebookEnabled: z.boolean().default(false),
});

export type PixelConfigFormValues = z.infer<typeof pixelConfigSchema>;
