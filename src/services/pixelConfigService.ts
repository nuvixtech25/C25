import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define the Pixel configuration type
export interface PixelConfig {
  id?: number;
  googleAdsPixels: GoogleAdsPixel[];
  facebookPixels: FacebookPixel[];
  taboolaPixel: TaboolaPixel;
  tiktokPixel: TiktokPixel;
  outbrainPixel: OutbrainPixel;
  uolAdsPixel: UolAdsPixel;
}

export interface GoogleAdsPixel {
  id: string;
  googleAdsId: string;
  conversionLabel?: string;
  enabled: boolean;
}

export interface FacebookPixel {
  id: string;
  facebookPixelId: string;
  facebookToken?: string;
  enabled: boolean;
}

export interface TaboolaPixel {
  taboolaAccountId: string;
  enabled: boolean;
}

export interface TiktokPixel {
  tiktokPixelId: string;
  enabled: boolean;
}

export interface OutbrainPixel {
  outbrainPixelId: string;
  enabled: boolean;
}

export interface UolAdsPixel {
  uolAdsId: string;
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
      .maybeSingle();
    
    if (error) throw error;
    
    // Convert database format to application format
    if (data) {
      return {
        id: data.id,
        googleAdsPixels: data.google_ads_id ? [
          {
            id: uuidv4(),
            googleAdsId: data.google_ads_id || '',
            conversionLabel: data.conversion_label || '',
            enabled: data.google_enabled || false
          }
        ] : [],
        facebookPixels: data.facebook_pixel_id ? [
          {
            id: uuidv4(),
            facebookPixelId: data.facebook_pixel_id || '',
            facebookToken: data.facebook_token || '',
            enabled: data.facebook_enabled || false
          }
        ] : [],
        taboolaPixel: {
          taboolaAccountId: '',
          enabled: false
        },
        tiktokPixel: {
          tiktokPixelId: '',
          enabled: false
        },
        outbrainPixel: {
          outbrainPixelId: '',
          enabled: false
        },
        uolAdsPixel: {
          uolAdsId: '',
          enabled: false
        }
      };
    }
    
    // Return default empty configuration
    return {
      googleAdsPixels: [],
      facebookPixels: [],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    };
  } catch (error) {
    console.error('Error fetching pixel config:', error);
    return {
      googleAdsPixels: [],
      facebookPixels: [],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    };
  }
};

// Update the Pixel configuration in Supabase
export const updatePixelConfig = async (config: PixelConfig): Promise<PixelConfig> => {
  try {
    let response;
    
    // Check if we have multiple Google Ads pixels
    const firstGoogleAds = config.googleAdsPixels[0] || { googleAdsId: '', conversionLabel: '', enabled: false };
    
    // Check if we have multiple Facebook pixels
    const firstFacebook = config.facebookPixels[0] || { facebookPixelId: '', facebookToken: '', enabled: false };
    
    // Convert application format to database format
    const dbData = {
      google_ads_id: firstGoogleAds.googleAdsId,
      conversion_label: firstGoogleAds.conversionLabel,
      google_enabled: firstGoogleAds.enabled,
      facebook_pixel_id: firstFacebook.facebookPixelId,
      facebook_token: firstFacebook.facebookToken,
      facebook_enabled: firstFacebook.enabled
    };
    
    console.log('Saving pixel config to database:', dbData);
    
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
    
    // Convert the response back to application format
    return {
      id: response.id,
      googleAdsPixels: [
        {
          id: uuidv4(),
          googleAdsId: response.google_ads_id || '',
          conversionLabel: response.conversion_label || '',
          enabled: response.google_enabled || false
        }
      ],
      facebookPixels: [
        {
          id: uuidv4(),
          facebookPixelId: response.facebook_pixel_id || '',
          facebookToken: response.facebook_token || '',
          enabled: response.facebook_enabled || false
        }
      ],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    };
  } catch (error) {
    console.error('Error updating pixel config:', error);
    throw error;
  }
};
