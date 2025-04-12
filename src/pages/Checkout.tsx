
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/checkout';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { supabase } from '@/integrations/supabase/client';

const Checkout: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    customerData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product || undefined);

  useEffect(() => {
    const fetchDefaultProduct = async () => {
      try {
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

    fetchDefaultProduct();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500">Produto não encontrado</h2>
          <p className="mt-2 text-gray-600">Não foi possível encontrar o produto solicitado.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  const customization = {
    headingColor: '#000000',
    buttonColor: '#28A745',
    buttonText: 'Finalizar Compra',
    isDigitalProduct: product.type === 'digital'
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
