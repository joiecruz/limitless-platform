import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Extend Window interface for Facebook Pixel
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

interface FacebookPixelProps {
  pixelId?: string;
}

export const FacebookPixel = ({ pixelId }: FacebookPixelProps) => {
  const location = useLocation();

  useEffect(() => {
    // Only initialize if pixelId is provided
    if (!pixelId) {
      console.log('Facebook Pixel: No pixel ID configured');
      return;
    }

    // Initialize Facebook Pixel
    const initPixel = () => {
      if (window.fbq) return; // Already initialized

      // Facebook Pixel base code
      const n = (window.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments as any)
          : n.queue.push(arguments);
      } as any);
      
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      // Load the Facebook Pixel script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      // Initialize with your Pixel ID
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    };

    initPixel();
  }, [pixelId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.fbq && pixelId) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, pixelId]);

  return null;
};

// Helper function to track custom events
export const trackFBEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('track', eventName, params);
  }
};

// Pre-defined event trackers for common actions
export const trackFBLead = (params?: Record<string, any>) => {
  trackFBEvent('Lead', params);
};

export const trackFBCompleteRegistration = (params?: Record<string, any>) => {
  trackFBEvent('CompleteRegistration', params);
};

export const trackFBInitiateCheckout = (params?: Record<string, any>) => {
  trackFBEvent('InitiateCheckout', params);
};

export const trackFBViewContent = (params: { content_name: string; content_category?: string; value?: number; currency?: string }) => {
  trackFBEvent('ViewContent', params);
};
