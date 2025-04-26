
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
}

// Log information about the current environment
console.log("App initializing with:", {
  hostname: window.location.hostname,
  pathname: window.location.pathname,
  protocol: window.location.protocol,
  href: window.location.href
});

// Mount React application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
