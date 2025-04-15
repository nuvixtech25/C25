
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { useToast } from '@/hooks/use-toast';
import { getProductBySlug } from '@/services/productService';
import { Product } from '@/types/checkout';
import { mapProductToCustomization } from '@/utils/propertyMappers';
import { TopMessageBanner } from '@/components/checkout/TopMessageBanner';

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const customization = useCheckoutCustomization(product || undefined);
  const {
    customerData,
    addressData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    handleAddressSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product || undefined);
  
  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) {
        console.error("Slug não informado");
        setError("Produto não encontrado. O código do produto (slug) não foi informado na URL.");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching product with slug:", productSlug);
        const data = await getProductBySlug(productSlug);
          
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
        setError("Não foi possível carregar o produto. Por favor, tente novamente.");
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
  }, [productSlug, toast]);
  
  // If loading or no product found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Carregando informações do produto..." />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState 
          title="Produto não encontrado" 
          message={error || "O produto que você está procurando não está disponível ou não existe."}
          actionLink="/"
          actionLabel="Voltar para a página inicial"
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Message Banner with Countdown - Always at the top */}
      <TopMessageBanner 
        message="Oferta por tempo limitado!"
        initialMinutes={24} 
        initialSeconds={0}
      />
      
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Product name as heading */}
          <h1 
            className="text-2xl md:text-3xl font-bold text-center mb-6"
            style={{ color: product.use_global_colors === false ? product.heading_color : customization.headingColor }}
          >
            {product.name}
          </h1>
          
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
