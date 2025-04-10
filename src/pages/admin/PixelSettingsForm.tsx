
import React from 'react';
import { Form } from '@/components/ui/form';
import { PixelFormCard } from '@/components/admin/pixel-settings/PixelFormCard';
import { GoogleAdsSection } from '@/components/admin/pixel-settings/GoogleAdsSection';
import { FacebookPixelSection } from '@/components/admin/pixel-settings/FacebookPixelSection';
import { SubmitButton } from '@/components/admin/pixel-settings/SubmitButton';
import { usePixelConfigForm } from '@/hooks/admin/usePixelConfigForm';

export const PixelSettingsForm = () => {
  const { form, loading, saving, onSubmit } = usePixelConfigForm();
  
  return (
    <PixelFormCard
      title="Configuração de Pixels de Rastreamento"
      description="Configure os pixels de rastreamento para o Google Ads e Facebook Ads (Meta)."
      loading={loading}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Google Ads Section */}
          <GoogleAdsSection form={form} />
          
          {/* Facebook Pixel Section */}
          <FacebookPixelSection form={form} />
          
          {/* Submit Button */}
          <SubmitButton saving={saving} />
        </form>
      </Form>
    </PixelFormCard>
  );
};

export default PixelSettingsForm;
