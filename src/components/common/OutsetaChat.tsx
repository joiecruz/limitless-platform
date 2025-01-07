import { useEffect } from 'react';

declare global {
  interface Window {
    o_options?: {
      domain: string;
      load: string;
    };
  }
}

export const OutsetaChat = () => {
  useEffect(() => {
    // Configure Outseta options
    window.o_options = {
      domain: 'limitlesslab.outseta.com',
      load: 'chat'
    };

    // Create and append the script
    const script = document.createElement('script');
    script.src = 'https://cdn.outseta.com/outseta.min.js';
    script.setAttribute('data-options', 'o_options');
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      delete window.o_options;
    };
  }, []);

  return null;
};