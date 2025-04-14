
import { z } from 'zod';

// Product form validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  image_url: z.string().optional(),
  banner_image_url: z.string().optional(),
  type: z.enum(['digital', 'physical']),
  status: z.boolean(),
  slug: z.string().optional(),
  has_whatsapp_support: z.boolean().default(false),
  whatsapp_number: z.string().optional(),
  use_global_colors: z.boolean().default(true),
  button_color: z.string().optional(),
  heading_color: z.string().optional(),
  banner_color: z.string().optional(),
});

// Form values type
export type ProductFormValues = z.infer<typeof productSchema>;

// Helper function to generate a slug from a product name
export const generateSlug = (name: string): string => {
  return name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais exceto hífens e underscores
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Substitui múltiplos hífens por um único
    .trim();
};
