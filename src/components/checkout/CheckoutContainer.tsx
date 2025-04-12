import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TopMessageBanner } from './TopMessageBanner';
import { CheckoutFooter } from './CheckoutFooter';

interface CheckoutContainerProps {
  children: React.ReactNode;
}

interface CheckoutCustomization {
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  header_message?: string;
  banner_image_url?: string;
  show_banner?: boolean;
  heading_color?: string;
  banner_color?: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ children }) => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CheckoutCustomization>({
    button_color: '#28A745',
    button_text_color: '#ffffff',
    button_text: 'Finalizar Pagamento',
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '/lovable-uploads/75584e12-d113-40d9-99bd-c222d0b06f29.png',
    show_banner: true,
    heading_color: '#000000',
    banner_color: '#000000'
  });
  const [isCustomizationLoaded, setIsCustomizationLoaded] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        console.log('Fetching checkout customization...');
        const { data, error } = await supabase
          .from('checkout_customization')
          .select('button_color, button_text_color, button_text, header_message, banner_image_url, show_banner, heading_color, banner_color')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching checkout customization:', error);
          toast({
            title: "Erro ao carregar",
            description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('Checkout customization loaded:', data);
          setCustomization(data as CheckoutCustomization);
        }
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
        toast({
          title: "Erro ao carregar",
          description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
          variant: "destructive",
        });
      } finally {
        setIsCustomizationLoaded(true);
      }
    };

    fetchCustomization();
  }, [toast]);

  // Add CSS variables for checkout button styling
  const customStyles = {
    '--button-color': customization.button_color || '#28A745',
    '--button-text-color': customization.button_text_color || '#ffffff',
    '--button-text': `'${customization.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': customization.heading_color || '#000000',
  } as React.CSSProperties;

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black max-w-full overflow-x-hidden" style={customStyles}>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 bg-white py-4"> {/* Added py-4 for vertical padding */}
          <div>
            {customization.show_banner && (
              <TopMessageBanner 
                message={customization.header_message || 'Oferta por tempo limitado!'} 
                initialMinutes={5} 
                initialSeconds={0} 
                bannerImageUrl={customization.banner_image_url}
                containerClassName="w-full"
              />
            )}
            
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
