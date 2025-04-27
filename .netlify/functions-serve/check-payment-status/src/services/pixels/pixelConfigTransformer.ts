
import { v4 as uuidv4 } from 'uuid';
import { 
  PixelConfig, 
  DatabasePixelConfig,
  GoogleAdsPixel,
  FacebookPixel 
} from './types';

export const transformDatabaseToAppFormat = (data: DatabasePixelConfig | null): PixelConfig => {
  if (!data) {
    return getDefaultPixelConfig();
  }

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
};

export const transformAppToDatabaseFormat = (config: PixelConfig): Partial<DatabasePixelConfig> => {
  const firstGoogleAds = config.googleAdsPixels[0] || { googleAdsId: '', conversionLabel: '', enabled: false };
  const firstFacebook = config.facebookPixels[0] || { facebookPixelId: '', facebookToken: '', enabled: false };

  return {
    google_ads_id: firstGoogleAds.googleAdsId,
    conversion_label: firstGoogleAds.conversionLabel,
    google_enabled: firstGoogleAds.enabled,
    facebook_pixel_id: firstFacebook.facebookPixelId,
    facebook_token: firstFacebook.facebookToken,
    facebook_enabled: firstFacebook.enabled
  };
};

export const getDefaultPixelConfig = (): PixelConfig => ({
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
});
