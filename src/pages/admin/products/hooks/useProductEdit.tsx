
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { productSchema, ProductFormValues, generateSlug } from '../ProductSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type ProductData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  banner_image_url: string | null;
  type: 'digital' | 'physical';
  status: boolean;
  slug: string;
  has_whatsapp_support?: boolean;
  whatsapp_number?: string | null;
  use_global_colors?: boolean;
  button_color?: string | null;
  heading_color?: string | null;
  banner_color?: string | null;
}

export const useProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      banner_image_url: '',
      type: 'physical',
      status: true,
      has_whatsapp_support: false,
      whatsapp_number: '',
      use_global_colors: true,
      button_color: '#28A745',
      heading_color: '#000000',
      banner_color: '#000000',
    },
  });

  const { isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do produto não fornecido');

      console.log(`[EditProductPage] Fetching product with ID: ${id}`);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[EditProductPage] Erro ao buscar produto:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Produto não encontrado');
      }

      // Cast data to ProductData type
      const productData = data as ProductData;
      
      console.log('[EditProductPage] Product data from DB:', productData);
      console.log('[EditProductPage] Custom colors:', {
        use_global_colors: productData.use_global_colors,
        button_color: productData.button_color,
        heading_color: productData.heading_color,
        banner_color: productData.banner_color
      });

      // Set form values
      form.reset({
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        image_url: productData.image_url || '',
        banner_image_url: productData.banner_image_url || '',
        type: productData.type,
        status: productData.status,
        slug: productData.slug,
        has_whatsapp_support: productData.has_whatsapp_support || false,
        whatsapp_number: productData.whatsapp_number || '',
        use_global_colors: true, // Default to true since these columns might not exist yet
        button_color: '#28A745',
        heading_color: '#000000',
        banner_color: '#000000',
      });

      return productData;
    },
    retry: false,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (!id) return;

      // Generate slug from name if not provided
      const slug = data.slug || generateSlug(data.name);
      
      console.log('[EditProductPage] Submitting product update:', { 
        ...data, 
        slug,
        has_whatsapp_support: data.has_whatsapp_support,
        whatsapp_number: data.has_whatsapp_support ? data.whatsapp_number : null
      });
      
      // We're removing custom color fields for now until the database schema is updated
      const { data: updatedData, error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description || null,
          price: data.price,
          image_url: data.image_url || null,
          banner_image_url: data.banner_image_url || null,
          type: data.type,
          status: data.status,
          slug: slug,
          has_whatsapp_support: data.has_whatsapp_support,
          whatsapp_number: data.has_whatsapp_support ? data.whatsapp_number : null
          // Removed color fields until database schema is updated
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('[EditProductPage] Erro de atualização detalhado:', error);
        if (error.code === '23505') {
          toast({
            title: 'Erro ao atualizar produto',
            description: 'Já existe um produto com este nome ou slug.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      console.log('[EditProductPage] Product updated successfully:', updatedData);
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
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    isSubmitting: form.formState.isSubmitting
  };
};
