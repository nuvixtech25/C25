
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TopMessageBanner } from './TopMessageBanner';
import { CheckoutFooter } from './CheckoutFooter';
import { CheckoutCustomization } from '@/types/checkout';

interface CheckoutContainerProps {
  children: React.ReactNode;
  productBannerUrl?: string; // Add prop for product-specific banner
  customization?: CheckoutCustomization; // Add prop for custom colors
}

interface CheckoutCustomizationDB {
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  header_message?: string;
  banner_image_url?: string;
  show_banner?: boolean;
  heading_color?: string;
  banner_color?: string;
}

// Define custom CSS Properties type to support CSS variables
interface CustomCSSProperties extends React.CSSProperties {
  '--button-color': string;
  '--button-text-color': string;
  '--button-text': string;
  '--heading-color': string;
  '--banner-color': string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  children,
  productBannerUrl, // Get product-specific banner URL
  customization // Get custom colors
}) => {
  const { toast } = useToast();
  const [dbCustomization, setDbCustomization] = useState<CheckoutCustomizationDB>({
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
          setDbCustomization(data as CheckoutCustomizationDB);
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

  // Use properly typed CSS variables with our custom interface
  const customStyles: CustomCSSProperties = {
    '--button-color': customization?.buttonColor || dbCustomization.button_color || '#28A745',
    '--button-text-color': dbCustomization.button_text_color || '#ffffff',
    '--button-text': `'${dbCustomization.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': customization?.headingColor || dbCustomization.heading_color || '#000000',
    '--banner-color': customization?.bannerColor || dbCustomization.banner_color || '#000000',
  };

  // Use product-specific banner URL if available, otherwise fall back to global setting
  const bannerImageUrl = productBannerUrl || dbCustomization.banner_image_url;
  
  console.log('Banner image being used:', { 
    productBanner: productBannerUrl, 
    globalBanner: dbCustomization.banner_image_url,
    finalBanner: bannerImageUrl 
  });

  console.log('Colors being used:', { 
    customButtonColor: customization?.buttonColor,
    dbButtonColor: dbCustomization.button_color,
    finalButtonColor: customStyles['--button-color'],
    customHeadingColor: customization?.headingColor,
    dbHeadingColor: dbCustomization.heading_color,
    finalHeadingColor: customStyles['--heading-color'],
    customBannerColor: customization?.bannerColor,
    dbBannerColor: dbCustomization.banner_color,
    finalBannerColor: customStyles['--banner-color'],
  });

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black max-w-full overflow-x-hidden" style={customStyles as React.CSSProperties}>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 bg-white py-4"> {/* Added py-4 for vertical padding */}
          <div>
            {dbCustomization.show_banner && (
              <TopMessageBanner 
                message={dbCustomization.header_message || 'Oferta por tempo limitado!'} 
                initialMinutes={5} 
                initialSeconds={0} 
                bannerImageUrl={bannerImageUrl}
                containerClassName="w-full"
                bannerColor={customStyles['--banner-color']}
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
