
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';

export const trackInitiateCheckout = (value: number, isInitialized: boolean) => {
  console.log(`Tracking initiate checkout: Value=${value}`);
  
  if (process.env.NODE_ENV !== 'production' || !isInitialized) {
    console.log('Initiate checkout tracking skipped: development mode or pixels not initialized');
    return;
  }
  
  // Track Google begin checkout
  if (typeof window !== 'undefined' && window.googleAdsPixels) {
    GooglePixel.trackBeginCheckout(value);
  }
  
  // Track Facebook initiate checkout
  if (typeof window !== 'undefined' && window.facebookPixels) {
    FacebookPixel.trackInitiateCheckout(value);
  }
  
  // Track TikTok initiate checkout
  if (typeof window !== 'undefined' && window.tiktokPixelId) {
    TiktokPixel.trackBeginCheckout(value);
  }
};
