import { useEffect } from "react";

export function OutsetaChat() {
  useEffect(() => {
    // Check if script is already loaded
    if (!document.getElementById('outseta-script')) {
      // Create and set options script
      const optionsScript = document.createElement('script');
      optionsScript.text = `
        var o_options = {
          domain: 'limitlesslab.outseta.com',
          load: 'chat'
        };
      `;
      document.head.appendChild(optionsScript);

      // Create and load Outseta script
      const script = document.createElement('script');
      script.id = 'outseta-script';
      script.src = 'https://cdn.outseta.com/outseta.min.js';
      script.setAttribute('data-options', 'o_options');
      document.head.appendChild(script);
    }

    // Cleanup
    return () => {
      const optionsScript = document.querySelector('script[text*="o_options"]');
      const outsetaScript = document.getElementById('outseta-script');
      
      if (optionsScript) {
        optionsScript.remove();
      }
      if (outsetaScript) {
        outsetaScript.remove();
      }
    };
  }, []);

  return null;
}