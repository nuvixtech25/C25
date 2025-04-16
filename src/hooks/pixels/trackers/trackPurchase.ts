
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';
import * as TaboolaPixel from '@/lib/pixels/taboolaPixel';
import * as OutbrainPixel from '@/lib/pixels/outbrainPixel';
import * as UolAdsPixel from '@/lib/pixels/uolAdsPixel';

export const trackPurchase = (orderId: string, value: number, isInitialized: boolean) => {
  console.log(`Tracking purchase: OrderID=${orderId}, Value=${value}`);
  
  if (process.env.NODE_ENV !== 'production' || !isInitialized) {
    console.log('Purchase tracking skipped: development mode or pixels not initialized');
    return;
  }
  
  // Track Google purchase for all pixels
  if (typeof window !== 'undefined' && window.googleAdsPixels) {
    window.googleAdsPixels.forEach(pixel => {
      GooglePixel.trackPurchase(orderId, value, pixel.conversionLabel);
    });
  }
  
  // Track Facebook purchase for all pixels
  if (typeof window !== 'undefined' && window.facebookPixels) {
    window.facebookPixels.forEach(() => {
      FacebookPixel.trackPurchase(value);
    });
  }
  
  // Track TikTok purchase
  if (typeof window !== 'undefined' && window.tiktokPixelId) {
    TiktokPixel.trackPurchase(value);
  }
  
  // Track Taboola purchase
  if (typeof window !== 'undefined' && window.taboolaAccountId) {
    TaboolaPixel.trackPurchase(value, orderId);
  }
  
  // Track Outbrain purchase
  if (typeof window !== 'undefined' && window.outbrainPixelId) {
    OutbrainPixel.trackPurchase(value);
  }
  
  // Track UOL Ads purchase
  if (typeof window !== 'undefined' && window.uolAdsId) {
    UolAdsPixel.trackPurchase(value, orderId);
  }
};
