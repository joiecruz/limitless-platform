import { useEffect } from "react";

export const OutsetaChat = () => {
  useEffect(() => {
    // Create container
    const container = document.createElement('div');
    container.id = 'outseta-chat-container';
    document.body.appendChild(container);

    // Create and inject style with stronger isolation
    const style = document.createElement('style');
    style.textContent = `
      #outseta-chat-container {
        position: fixed;
        z-index: 9999;
        bottom: 0;
        right: 0;
        all: initial;
      }

      #outseta-chat-container * {
        all: revert;
      }

      /* Explicitly prevent Outseta styles from affecting page headings */
      body > *:not(#outseta-chat-container) h1,
      body > *:not(#outseta-chat-container) h2,
      body > *:not(#outseta-chat-container) h3,
      body > *:not(#outseta-chat-container) h4,
      body > *:not(#outseta-chat-container) h5,
      body > *:not(#outseta-chat-container) h6 {
        font-weight: bold !important;
        font-family: inherit !important;
      }

      /* Reset Outseta's own headings */
      #outseta-chat-container h1,
      #outseta-chat-container h2,
      #outseta-chat-container h3,
      #outseta-chat-container h4,
      #outseta-chat-container h5,
      #outseta-chat-container h6 {
        all: revert;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    // Create and inject Outseta options script
    const optionsScript = document.createElement('script');
    optionsScript.text = `
      var o_options = {
        domain: 'limitlesslab.outseta.com',
        load: 'chat'
      };
    `;
    container.appendChild(optionsScript);

    // Create and inject Outseta main script
    const script = document.createElement('script');
    script.src = 'https://cdn.outseta.com/outseta.min.js';
    script.setAttribute('data-options', 'o_options');
    container.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(container);
      document.head.removeChild(style);
    };
  }, []);

  return null;
};