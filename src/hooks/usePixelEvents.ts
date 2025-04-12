
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
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
          
          // Initialize Google Pixel if enabled and ID exists
          if (config.googleEnabled && config.googleAdsId) {
            GooglePixel.initGooglePixel(config.googleAdsId);
            
            // Set global variables for access in window
            if (typeof window !== 'undefined') {
              window.googleAdsId = config.googleAdsId;
              window.conversionLabel = config.conversionLabel || '';
            }
          }
          
          // Initialize Facebook Pixel if enabled and ID exists
          if (config.facebookEnabled && config.facebookPixelId) {
            FacebookPixel.initFacebookPixel(config.facebookPixelId, config.facebookToken);
            
            // Set global variables for access in window
            if (typeof window !== 'undefined') {
              window.facebookPixelId = config.facebookPixelId;
              window.facebookToken = config.facebookToken || '';
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
      if (typeof window !== 'undefined' && window.googleAdsId) {
        GooglePixel.trackPageView(location.pathname);
      }
      
      // Track Facebook page view if initialized
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        FacebookPixel.trackPageView();
      }
      
      // Check for specific pages to trigger events
      if (location.pathname.includes('/checkout/')) {
        // Begin checkout events
        if (typeof window !== 'undefined' && window.googleAdsId) {
          GooglePixel.trackBeginCheckout();
        }
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          FacebookPixel.trackInitiateCheckout();
        }
      }
    }
  }, [location.pathname, pixelInitialized]);
  
  // Event tracking functions
  const trackPurchase = (orderId: string, value: number) => {
    if (process.env.NODE_ENV === 'production' && pixelInitialized) {
      // Track Google purchase if initialized
      if (typeof window !== 'undefined' && window.googleAdsId) {
        GooglePixel.trackPurchase(orderId, value, window.conversionLabel);
      }
      
      // Track Facebook purchase if initialized
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        FacebookPixel.trackPurchase(value);
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
    googleAdsId: string;
    conversionLabel: string;
    facebookPixelId: string;
    facebookToken: string;
  }
}
