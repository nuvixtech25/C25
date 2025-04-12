
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/checkout';

/**
 * Fetches a product by its slug
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product by slug:", error);
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    // Map the database product to our Product type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      isDigital: data.type === 'digital',
      type: (data.type === 'digital' || data.type === 'physical') 
        ? data.type as 'digital' | 'physical' 
        : 'physical',
      imageUrl: data.image_url || undefined,
      status: data.status,
      slug: data.slug,
      has_whatsapp_support: data.has_whatsapp_support || false,
      whatsapp_number: data.whatsapp_number || undefined
    };
  } catch (error) {
    console.error("Error in fetchProductBySlug:", error);
    return null;
  }
};
