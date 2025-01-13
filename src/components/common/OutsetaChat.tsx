import { useEffect } from "react";

export const OutsetaChat = () => {
  useEffect(() => {
    // Create container
    const container = document.createElement('div');
    container.id = 'outseta-chat-container';
    document.body.appendChild(container);

    // Create and inject style
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