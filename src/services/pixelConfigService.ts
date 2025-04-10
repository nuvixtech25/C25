import { supabase } from '@/integrations/supabase/client';

// Define the Pixel configuration type
export interface PixelConfig {
  id?: number;
  googleAdsId: string;
  conversionLabel?: string;
  facebookPixelId: string;
  facebookToken?: string;
  googleEnabled: boolean;
  facebookEnabled: boolean;
}

// Fetch the Pixel configuration from Supabase
export const fetchPixelConfig = async (): Promise<PixelConfig> => {
  try {
    const { data, error } = await supabase
      .from('pixel_config')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      googleAdsId: data.google_ads_id || '',
      conversionLabel: data.conversion_label || '',
      facebookPixelId: data.facebook_pixel_id || '',
      facebookToken: data.facebook_token || '',
      googleEnabled: data.google_enabled || false,
      facebookEnabled: data.facebook_enabled || false,
    } : {
      googleAdsId: '',
      conversionLabel: '',
      facebookPixelId: '',
      facebookToken: '',
      googleEnabled: false,
      facebookEnabled: false,
    };
  } catch (error) {
    console.error('Error fetching pixel config:', error);
    return {
      googleAdsId: '',
      conversionLabel: '',
      facebookPixelId: '',
      facebookToken: '',
      googleEnabled: false,
      facebookEnabled: false,
    };
  }
};

// Update the Pixel configuration in Supabase
export const updatePixelConfig = async (config: PixelConfig): Promise<PixelConfig> => {
  try {
    let response;
    
    const dbData = {
      google_ads_id: config.googleAdsId,
      conversion_label: config.conversionLabel,
      facebook_pixel_id: config.facebookPixelId,
      facebook_token: config.facebookToken,
      google_enabled: config.googleEnabled,
      facebook_enabled: config.facebookEnabled,
    };
    
    // If there's no ID, it's a new record
    if (!config.id) {
      const { data, error } = await supabase
        .from('pixel_config')
        .insert([dbData])
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    } else {
      // Otherwise, update the existing record
      const { data, error } = await supabase
        .from('pixel_config')
        .update(dbData)
        .eq('id', config.id)
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    }
    
    return {
      id: response.id,
      googleAdsId: response.google_ads_id || '',
      conversionLabel: response.conversion_label || '',
      facebookPixelId: response.facebook_pixel_id || '',
      facebookToken: response.facebook_token || '',
      googleEnabled: response.google_enabled || false,
      facebookEnabled: response.facebook_enabled || false,
    };
  } catch (error) {
    console.error('Error updating pixel config:', error);
    throw error;
  }
};
