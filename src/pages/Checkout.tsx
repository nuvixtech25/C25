
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product, CheckoutCustomization } from '@/types/checkout';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { supabase } from '@/integrations/supabase/client';
import { fetchProductBySlug } from '@/services/productService';
import { CheckoutError } from '@/components/checkout/CheckoutError';

const Checkout: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productSlug } = useParams<{ productSlug?: string }>();

  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product || undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // If product slug is provided in the URL, fetch that specific product
        if (productSlug) {
          console.log(`Fetching product with slug: ${productSlug}`);
          const foundProduct = await fetchProductBySlug(productSlug);
          
          if (foundProduct) {
            console.log(`Found product:`, foundProduct);
            setProduct(foundProduct);
            return;
          } else {
            console.error(`Product with slug "${productSlug}" not found`);
            toast({
              title: "Produto não encontrado",
              description: `O produto "${productSlug}" não foi encontrado.`,
              variant: "destructive",
            });
          }
        }
        
        // If no slug or product not found, fetch default product
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_default', true)
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching default product:', error);
          toast({
            title: "Erro ao carregar produto",
            description: "Não foi possível carregar o produto padrão.",
            variant: "destructive",
          });

          // Fallback to a demo product if no default product is found
          setProduct({
            id: 'demo-product',
            name: 'Produto Demonstração',
            description: 'Este é um produto de demonstração para testes de checkout.',
            price: 49.90,
            imageUrl: '/placeholder.svg',
            has_whatsapp_support: true,
            whatsapp_number: '5511999999999',
            type: 'digital'
          });
        } else if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.image_url,
            has_whatsapp_support: data.has_whatsapp_support,
            whatsapp_number: data.whatsapp_number,
            type: data.type || 'digital'
          });
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        toast({
          title: "Erro ao carregar",
          description: "Ocorreu um erro ao carregar o produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  if (!product) {
    return <CheckoutError message={`Produto "${productSlug || ''}" não encontrado.`} />;
  }

  const customization: CheckoutCustomization = {
    headingColor: '#000000',
    buttonColor: '#28A745',
    buttonText: 'Finalizar Compra',
    bannerImageUrl: null,
    topMessage: 'Oferta por tempo limitado!',
    countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isDigitalProduct: product.type === 'digital',
    bannerColor: '#000000' // Added default banner color
  };

  return (
    <CheckoutContainer>
      <CheckoutContent 
        product={product}
        customerData={customerData}
        paymentMethod={paymentMethod}
        isSubmitting={isSubmitting}
        customization={customization}
        onCustomerSubmit={handleCustomerSubmit}
        onPaymentMethodChange={setPaymentMethod}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </CheckoutContainer>
  );
};

export default Checkout;
