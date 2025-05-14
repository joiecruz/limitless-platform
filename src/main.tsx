
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isApexDomain } from './utils/domainHelpers.ts'
import { getWwwUrl } from './utils/domainHelpers.ts'

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
  href: window.location.href,
  isApexDomain: isApexDomain()
});

// Set a session storage flag to prevent redirect loops
const hasRedirected = sessionStorage.getItem('apex_redirect_attempted');

// Redirect apex domain to www if needed, but only if we haven't tried redirecting before
if (isApexDomain() && !hasRedirected) {
  console.log("Redirecting from apex domain to www subdomain");
  sessionStorage.setItem('apex_redirect_attempted', 'true');
  window.location.href = `${getWwwUrl()}${window.location.pathname}${window.location.search}`;
} else {
  // Mount React application
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  // Clear the redirect flag after successful mount
  if (hasRedirected) {
    sessionStorage.removeItem('apex_redirect_attempted');
  }
}
