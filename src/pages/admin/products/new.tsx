
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductForm } from './ProductForm';
import { productSchema, ProductFormValues, generateSlug } from './ProductSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const NewProductPage = () => {
  const navigate = useNavigate();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      type: 'physical',
      status: true,
      has_whatsapp_support: false,
      whatsapp_number: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Generate slug from name if not provided
      const slug = data.slug || generateSlug(data.name);
      
      console.log('Submitting product data:', {
        ...data,
        slug,
        has_whatsapp_support: data.has_whatsapp_support,
        whatsapp_number: data.has_whatsapp_support ? data.whatsapp_number : null,
      });
      
      // Use type assertion to tell TypeScript we know what we're doing
      const { error } = await supabase.from('products').insert({
        name: data.name,
        description: data.description || null,
        image_url: data.image_url || null,
        price: data.price,
        type: data.type,
        status: data.status,
        slug: slug,
        has_whatsapp_support: data.has_whatsapp_support,
        whatsapp_number: data.has_whatsapp_support ? data.whatsapp_number : null,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Erro ao criar produto',
            description: 'Já existe um produto com este nome ou slug.',
            variant: 'destructive',
          });
        } else {
          console.error('Erro detalhado:', error);
          throw error;
        }
        return;
      }

      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso!',
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro ao criar produto',
        description: 'Ocorreu um erro ao tentar criar o produto. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      <ProductForm 
        form={form} 
        onSubmit={onSubmit} 
        isSubmitting={form.formState.isSubmitting} 
      />
    </div>
  );
};

export default NewProductPage;
