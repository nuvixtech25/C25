
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/checkout';

/**
 * Fetches a product by its slug with enhanced WhatsApp support details
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    console.log(`[productService] Fetching product with slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("[productService] Error fetching product by slug:", error);
      throw new Error(error.message);
    }

    if (!data) {
      console.log("[productService] No product found with slug:", slug);
      return null;
    }

    console.log("[productService] Raw product data from database:", data);
    console.log("[productService] WhatsApp support details:", {
      has_whatsapp_support: data.has_whatsapp_support,
      whatsapp_number: data.whatsapp_number,
      supportType: typeof data.has_whatsapp_support,
      numberType: typeof data.whatsapp_number
    });

    // Map the database product to our Product type with WhatsApp support
    const product = {
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
      whatsapp_number: data.whatsapp_number || undefined,
      bannerImageUrl: data.banner_image_url || undefined // Added for product-specific banner
    };

    console.log("[productService] Mapped product with details:", {
      id: product.id,
      name: product.name,
      has_whatsapp_support: product.has_whatsapp_support,
      whatsapp_number: product.whatsapp_number,
      bannerImageUrl: product.bannerImageUrl
    });

    return product;
  } catch (error) {
    console.error("[productService] Error in fetchProductBySlug:", error);
    return null;
  }
};
