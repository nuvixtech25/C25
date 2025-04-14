
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { CheckoutBanner } from '@/components/checkout/CheckoutBanner';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { CheckoutNav } from '@/components/checkout/CheckoutNav';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { LoadingState } from '@/components/shared/LoadingState';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/checkout';
import { mapProductToCustomization } from '@/utils/propertyMappers';

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const customization = useCheckoutCustomization(product);
  const {
    customerData,
    addressData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    handleAddressSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product);
  
  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        console.error("Slug não informado");
        toast({
          title: "Erro",
          description: "Produto não encontrado",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('status', true)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error("Produto não encontrado");
        }
        
        // Format product data
        const productData: Product = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          image_url: data.image_url || '',
          banner_image_url: data.banner_image_url || '',
          price: data.price || 0,
          type: data.type || 'digital',
          isDigital: data.type === 'digital',
          use_global_colors: data.use_global_colors,
          button_color: data.button_color,
          heading_color: data.heading_color,
          banner_color: data.banner_color,
          has_whatsapp_support: data.has_whatsapp_support,
          whatsapp_number: data.whatsapp_number,
          status: data.status
        };
        
        setProduct(productData);
        console.log('Product data loaded:', productData);
        
      } catch (error: any) {
        console.error("Erro ao carregar produto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o produto. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug, toast]);
  
  // If loading or no product found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Carregando informações do produto..." />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
          <p className="text-gray-600">O produto que você está procurando não está disponível ou não existe.</p>
        </div>
      </div>
    );
  }
  
  // Extract customization settings from product
  const productCustomization = mapProductToCustomization(product);
  
  // Create banner style
  const getBannerStyle = () => {
    const styles: React.CSSProperties = {};
    
    // Apply banner background color based on settings
    if (product.use_global_colors === false && product.banner_color) {
      styles.backgroundColor = product.banner_color;
    } else {
      styles.backgroundColor = customization.bannerColor;
    }
    
    // Apply banner image if available
    if (product.banner_image_url) {
      styles.backgroundImage = `url(${product.banner_image_url})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
    }
    
    return styles;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CheckoutNav />
      
      <div 
        className="w-full py-8 px-4 bg-cover bg-center"
        style={getBannerStyle()}
      >
        <CheckoutBanner 
          productName={product.name} 
          headingColor={product.use_global_colors === false ? product.heading_color : customization.headingColor}
        />
      </div>
      
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <CheckoutContent 
            product={product}
            customerData={customerData}
            paymentMethod={paymentMethod}
            isSubmitting={isSubmitting}
            customization={{
              ...customization,
              useGlobalColors: product.use_global_colors,
              buttonColor: !product.use_global_colors ? product.button_color || customization.buttonColor : customization.buttonColor,
              headingColor: !product.use_global_colors ? product.heading_color || customization.headingColor : customization.headingColor,
              bannerColor: !product.use_global_colors ? product.banner_color || customization.bannerColor : customization.bannerColor,
            }}
            onCustomerSubmit={handleCustomerSubmit}
            onAddressSubmit={handleAddressSubmit}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentSubmit={handlePaymentSubmit}
          />
        </div>
      </div>
      
      <footer className="py-4 bg-gray-100 mt-8">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
