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
      load: 'chat',
    };

    // Create a container div for Outseta
    const container = document.createElement('div');
    container.id = 'outseta-chat-container';
    container.style.cssText = 'position: fixed; z-index: 9999; bottom: 0; right: 0;';
    document.body.appendChild(container);

    // Create and append the script to the container
    const script = document.createElement('script');
    script.src = 'https://cdn.outseta.com/outseta.min.js';
    script.setAttribute('data-options', 'o_options');
    container.appendChild(script);

    // Add a style tag to scope Outseta styles
    const style = document.createElement('style');
    style.textContent = `
      #outseta-chat-container {
        isolation: isolate;
        all: initial;
      }
      #outseta-chat-container * {
        all: revert;
        font-weight: initial !important;
      }
      #outseta-chat-container h1,
      #outseta-chat-container h2,
      #outseta-chat-container h3,
      #outseta-chat-container h4,
      #outseta-chat-container h5,
      #outseta-chat-container h6 {
        font-weight: initial !important;
        font-family: initial !important;
        line-height: initial !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.body.removeChild(container);
      document.head.removeChild(style);
      delete window.o_options;
    };
  }, []);

  return null;
};