
import { supabase } from '@/integrations/supabase/client';

// Define the Pixel configuration type
export interface PixelConfig {
  id?: number;
  googleAdsId: string;
  conversionLabel?: string;
  facebookPixelId: string;
  facebookToken?: string;
  enabled: boolean;
}

// Fetch the Pixel configuration from Supabase
export const fetchPixelConfig = async (): Promise<PixelConfig> => {
  try {
    const { data, error } = await supabase
      .from('pixel_config')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();
    
    if (error) throw error;
    
    return data || {
      googleAdsId: '',
      conversionLabel: '',
      facebookPixelId: '',
      facebookToken: '',
      enabled: false
    };
  } catch (error) {
    console.error('Error fetching pixel config:', error);
    return {
      googleAdsId: '',
      conversionLabel: '',
      facebookPixelId: '',
      facebookToken: '',
      enabled: false
    };
  }
};

// Update the Pixel configuration in Supabase
export const updatePixelConfig = async (config: PixelConfig): Promise<PixelConfig> => {
  try {
    let response;
    
    // If there's no ID, it's a new record
    if (!config.id) {
      const { data, error } = await supabase
        .from('pixel_config')
        .insert([config])
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    } else {
      // Otherwise, update the existing record
      const { data, error } = await supabase
        .from('pixel_config')
        .update(config)
        .eq('id', config.id)
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    }
    
    return response;
  } catch (error) {
    console.error('Error updating pixel config:', error);
    throw error;
  }
};
