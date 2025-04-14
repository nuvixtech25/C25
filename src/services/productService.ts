
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/checkout';

/**
 * Fetches a product by its slug with enhanced WhatsApp support details and custom colors
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
    console.log("[productService] Custom colors:", {
      use_global_colors: data.use_global_colors,
      button_color: data.button_color,
      heading_color: data.heading_color,
      banner_color: data.banner_color
    });

    // Map the database product to our Product type with all custom fields
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
      bannerImageUrl: data.banner_image_url || undefined, // Banner image URL
      
      // Product-specific colors
      useGlobalColors: data.use_global_colors !== false, // Default to true if not specified
      buttonColor: data.button_color || undefined,
      headingColor: data.heading_color || undefined,
      bannerColor: data.banner_color || undefined
    };

    console.log("[productService] Product with custom colors:", {
      id: product.id,
      name: product.name,
      useGlobalColors: product.useGlobalColors,
      buttonColor: product.buttonColor,
      headingColor: product.headingColor,
      bannerColor: product.bannerColor
    });

    return product;
  } catch (error) {
    console.error("[productService] Error in fetchProductBySlug:", error);
    return null;
  }
};
