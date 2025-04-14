
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';
import * as TaboolaPixel from '@/lib/pixels/taboolaPixel';
import * as OutbrainPixel from '@/lib/pixels/outbrainPixel';
import * as UolAdsPixel from '@/lib/pixels/uolAdsPixel';
import { fetchPixelConfig } from '@/services/pixelConfigService';

interface UsePixelEventsProps {
  // Initialize pixels on component mount
  initialize?: boolean;
}

export const usePixelEvents = ({ initialize = false }: UsePixelEventsProps = {}) => {
  const location = useLocation();
  const [pixelInitialized, setPixelInitialized] = useState(false);
  
  // Initialize pixels on component mount
  useEffect(() => {
    if (initialize && process.env.NODE_ENV === 'production' && !pixelInitialized) {
      const initializePixels = async () => {
        try {
          // Fetch configuration from database
          const config = await fetchPixelConfig();
          
          // Initialize Google Ads Pixels if enabled
          if (config.googleAdsPixels && config.googleAdsPixels.length > 0) {
            config.googleAdsPixels.forEach(pixel => {
              if (pixel.enabled && pixel.googleAdsId) {
                GooglePixel.initGooglePixel(pixel.googleAdsId);
                
                // Store in window for later use
                if (typeof window !== 'undefined') {
                  window.googleAdsPixels = window.googleAdsPixels || [];
                  window.googleAdsPixels.push({
                    googleAdsId: pixel.googleAdsId,
                    conversionLabel: pixel.conversionLabel || ''
                  });
                }
              }
            });
          }
          
          // Initialize Facebook Pixels if enabled
          if (config.facebookPixels && config.facebookPixels.length > 0) {
            config.facebookPixels.forEach(pixel => {
              if (pixel.enabled && pixel.facebookPixelId) {
                FacebookPixel.initFacebookPixel(pixel.facebookPixelId, pixel.facebookToken);
                
                // Store in window for later use
                if (typeof window !== 'undefined') {
                  window.facebookPixels = window.facebookPixels || [];
                  window.facebookPixels.push({
                    facebookPixelId: pixel.facebookPixelId,
                    facebookToken: pixel.facebookToken || ''
                  });
                }
              }
            });
          }
          
          // Initialize TikTok Pixel if enabled
          if (config.tiktokPixel?.enabled && config.tiktokPixel?.tiktokPixelId) {
            TiktokPixel.initTiktokPixel(config.tiktokPixel.tiktokPixelId);
            
            // Store in window for later use
            if (typeof window !== 'undefined') {
              window.tiktokPixelId = config.tiktokPixel.tiktokPixelId;
            }
          }
          
          // Initialize Taboola Pixel if enabled
          if (config.taboolaPixel?.enabled && config.taboolaPixel?.taboolaAccountId) {
            TaboolaPixel.initTaboolaPixel(config.taboolaPixel.taboolaAccountId);
            
            // Store in window for later use
            if (typeof window !== 'undefined') {
              window.taboolaAccountId = config.taboolaPixel.taboolaAccountId;
            }
          }
          
          // Initialize Outbrain Pixel if enabled
          if (config.outbrainPixel?.enabled && config.outbrainPixel?.outbrainPixelId) {
            OutbrainPixel.initOutbrainPixel(config.outbrainPixel.outbrainPixelId);
            
            // Store in window for later use
            if (typeof window !== 'undefined') {
              window.outbrainPixelId = config.outbrainPixel.outbrainPixelId;
            }
          }
          
          // Initialize UOL Ads Pixel if enabled
          if (config.uolAdsPixel?.enabled && config.uolAdsPixel?.uolAdsId) {
            UolAdsPixel.initUolAdsPixel(config.uolAdsPixel.uolAdsId);
            
            // Store in window for later use
            if (typeof window !== 'undefined') {
              window.uolAdsId = config.uolAdsPixel.uolAdsId;
            }
          }
          
          setPixelInitialized(true);
        } catch (error) {
          console.error('Error initializing pixels:', error);
        }
      };
      
      initializePixels();
    }
  }, [initialize, pixelInitialized]);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && pixelInitialized) {
      // Track Google Ads page view if initialized
      if (typeof window !== 'undefined' && window.googleAdsPixels) {
        GooglePixel.trackPageView(location.pathname);
      }
      
      // Track Facebook page view if initialized
      if (typeof window !== 'undefined' && window.facebookPixels) {
        FacebookPixel.trackPageView();
      }
      
      // Track TikTok page view if initialized
      if (typeof window !== 'undefined' && window.tiktokPixelId) {
        TiktokPixel.trackPageView();
      }
      
      // Check for specific pages to trigger events
      if (location.pathname.includes('/checkout/')) {
        // Begin checkout events for all pixels
        if (typeof window !== 'undefined') {
          if (window.googleAdsPixels) GooglePixel.trackBeginCheckout();
          if (window.facebookPixels) FacebookPixel.trackInitiateCheckout();
        }
      }
    }
  }, [location.pathname, pixelInitialized]);
  
  // Event tracking functions
  const trackPurchase = (orderId: string, value: number) => {
    if (process.env.NODE_ENV === 'production' && pixelInitialized) {
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
    }
  };
  
  return {
    trackPurchase
  };
};

// Declare global window interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    ttq: any;
    obApi: any;
    _tfa: any[];
    googleAdsPixels: Array<{googleAdsId: string, conversionLabel: string}>;
    facebookPixels: Array<{facebookPixelId: string, facebookToken: string}>;
    tiktokPixelId: string;
    taboolaAccountId: string;
    outbrainPixelId: string;
    uolAdsId: string;
  }
}
