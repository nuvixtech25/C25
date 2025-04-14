
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProductFormValues, generateSlug } from './ProductSchema';
import BasicInfoSection from './components/FormSections/BasicInfoSection';
import ImageSection from './components/FormSections/ImageSection';
import TypeSection from './components/FormSections/TypeSection';
import AppearanceSection from './components/FormSections/AppearanceSection';
import WhatsAppSection from './components/FormSections/WhatsAppSection';
import StatusSection from './components/FormSections/StatusSection';
import FormActions from './components/FormSections/FormActions';

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export function ProductForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  isEditing = false 
}: ProductFormProps) {
  // Watch name to generate slug
  const name = form.watch('name');
  
  // Generate slug when name changes
  useEffect(() => {
    if (name && !isEditing && !form.getValues('slug')) {
      const generatedSlug = generateSlug(name);
      form.setValue('slug', generatedSlug);
    }
  }, [name, form, isEditing]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <ImageSection form={form} />
            <TypeSection form={form} />
            <AppearanceSection form={form} />
            <WhatsAppSection form={form} />
            <StatusSection form={form} />
            <FormActions isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
