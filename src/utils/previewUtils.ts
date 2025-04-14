
import { Product } from '@/types/checkout';

/**
 * Mock product data for previews
 */
export const createMockProduct = (): Product => {
  return {
    id: 'mock-product-id',
    name: 'Produto de Demonstração',
    slug: 'produto-demo',
    description: 'Este é um produto de demonstração para visualização do checkout.',
    image_url: 'https://via.placeholder.com/150',
    banner_image_url: '',
    price: 97,
    type: 'digital',
    isDigital: true,
    use_global_colors: true,
    button_color: '#22c55e',
    heading_color: '#ffffff',
    banner_color: '#000000',
    status: true,
    has_whatsapp_support: false
  };
};

/**
 * Creates a modified product for testing different appearance settings
 */
export const createCustomizedProduct = (customization: any): Product => {
  return {
    ...createMockProduct(),
    use_global_colors: false,
    button_color: customization.buttonColor || '#ff6b6b',
    heading_color: customization.headingColor || '#333333',
    banner_color: customization.bannerColor || '#f9fafb',
    banner_image_url: customization.bannerImageUrl || ''
  };
};
