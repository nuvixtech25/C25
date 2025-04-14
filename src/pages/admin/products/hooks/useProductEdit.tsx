
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '../ProductSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useProductEdit = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      banner_image_url: '',
      type: 'physical',
      use_global_colors: true, // Por padrão usa cores globais
      button_color: '#28A745',
      heading_color: '#000000',
      banner_color: '#000000',
      status: true,
      has_whatsapp_support: false,
      whatsapp_number: '',
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError(new Error('Slug não informado'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error: supaError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supaError) {
          throw new Error(`Erro ao buscar produto: ${supaError.message}`);
        }

        if (!data) {
          throw new Error('Produto não encontrado');
        }

        console.log('Dados do produto carregados:', data);

        // Mapear dados do banco para o formulário
        form.reset({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          price: data.price,
          image_url: data.image_url || '',
          banner_image_url: data.banner_image_url || '',
          type: data.type,
          use_global_colors: data.use_global_colors === false ? false : true, // Se for null ou undefined, assume true
          button_color: data.button_color || '#28A745',
          heading_color: data.heading_color || '#000000',
          banner_color: data.banner_color || '#000000',
          status: data.status,
          has_whatsapp_support: data.has_whatsapp_support || false,
          whatsapp_number: data.whatsapp_number || '',
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, form]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      const { whatsapp_number, ...restData } = data;
      
      console.log('[EditProductPage] Submitting product data:', {
        ...restData,
        has_whatsapp_support: data.has_whatsapp_support,
        whatsapp_number: data.has_whatsapp_support ? whatsapp_number : null,
        use_global_colors: data.use_global_colors,
        button_color: data.use_global_colors ? null : data.button_color,
        heading_color: data.use_global_colors ? null : data.heading_color, 
        banner_color: data.use_global_colors ? null : data.banner_color,
      });
      
      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description || null,
          price: data.price,
          image_url: data.image_url || null,
          banner_image_url: data.banner_image_url || null,
          type: data.type,
          status: data.status,
          has_whatsapp_support: data.has_whatsapp_support,
          whatsapp_number: data.has_whatsapp_support ? whatsapp_number : null,
          use_global_colors: data.use_global_colors,
          button_color: data.use_global_colors ? null : data.button_color,
          heading_color: data.use_global_colors ? null : data.heading_color,
          banner_color: data.use_global_colors ? null : data.banner_color,
        })
        .eq('slug', slug);

      if (error) {
        console.error('[EditProductPage] Erro ao atualizar produto:', error);
        toast({
          title: 'Erro ao atualizar produto',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso!',
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error('[EditProductPage] Erro ao atualizar produto:', error);
      toast({
        title: 'Erro ao atualizar produto',
        description: 'Ocorreu um erro ao tentar atualizar o produto. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    isSubmitting
  };
};
