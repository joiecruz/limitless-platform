import { useEffect } from 'react';

declare global {
  interface Window {
    o_options?: {
      domain: string;
      load: string;
    };
    Outseta?: any;
  }
}

export function OutsetaChat() {
  useEffect(() => {
    // Only add the script if it hasn't been added before
    if (!document.getElementById('outseta-script')) {
      // Set options
      window.o_options = {
        domain: 'limitlesslab.outseta.com',
        load: 'chat'
      };

      // Create and append script
      const script = document.createElement('script');
      script.id = 'outseta-script';
      script.src = 'https://cdn.outseta.com/outseta.min.js';
      script.setAttribute('data-options', 'o_options');
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup is not needed as we want the chat to persist
    };
  }, []);

  return null;
}