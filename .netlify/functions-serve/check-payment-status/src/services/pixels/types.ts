
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

export interface DatabasePixelConfig {
  id: number;
  google_ads_id: string | null;
  conversion_label: string | null;
  google_enabled: boolean;
  facebook_pixel_id: string | null;
  facebook_token: string | null;
  facebook_enabled: boolean;
}
