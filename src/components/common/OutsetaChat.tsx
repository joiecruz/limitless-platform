import { useEffect } from 'react';

export function OutsetaChat() {
  useEffect(() => {
    // Create container for Outseta chat
    const container = document.createElement('div');
    container.id = 'outseta-chat-container';
    document.body.appendChild(container);

    // Create and inject style with stronger heading styles
    const style = document.createElement('style');
    style.textContent = `
      #outseta-chat-container {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 9999;
      }

      #outseta-chat-container * {
        all: revert;
      }

      /* Enforce bold headings globally */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 700 !important;
      }

      /* Reset Outseta's own headings if needed */
      #outseta-chat-container h1,
      #outseta-chat-container h2,
      #outseta-chat-container h3,
      #outseta-chat-container h4,
      #outseta-chat-container h5,
      #outseta-chat-container h6 {
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

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(container);
    };
  }, []);

  return null;
}