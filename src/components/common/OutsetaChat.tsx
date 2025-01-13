import { useEffect } from 'react';

export function OutsetaChat() {
  useEffect(() => {
    // Create container for Outseta chat
    const container = document.createElement('div');
    container.id = 'outseta-chat-container';
    document.body.appendChild(container);

    // Create and inject style with stronger specificity and proper isolation
    const style = document.createElement('style');
    style.textContent = `
      #outseta-chat-container {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 9999;
      }

      /* Reset only Outseta's own styles */
      #outseta-chat-container * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      /* Enforce bold headings globally with maximum specificity */
      html body h1:not([class*="outseta"]):not(#outseta-chat-container h1),
      html body h2:not([class*="outseta"]):not(#outseta-chat-container h2),
      html body h3:not([class*="outseta"]):not(#outseta-chat-container h3),
      html body h4:not([class*="outseta"]):not(#outseta-chat-container h4),
      html body h5:not([class*="outseta"]):not(#outseta-chat-container h5),
      html body h6:not([class*="outseta"]):not(#outseta-chat-container h6) {
        font-weight: 700 !important;
      }

      /* Ensure Outseta headings maintain their styles */
      #outseta-chat-container h1,
      #outseta-chat-container h2,
      #outseta-chat-container h3,
      #outseta-chat-container h4,
      #outseta-chat-container h5,
      #outseta-chat-container h6 {
        font-family: inherit;
        font-weight: inherit;
      }
    `;
    document.head.appendChild(style);

    // Create and inject Outseta options script
    const optionsScript = document.createElement('script');
    optionsScript.text = `
      var o_options = {
        domain: 'limitlesslab.outseta.com',
        load: 'chat',
        defaultWidget: 'chat'
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