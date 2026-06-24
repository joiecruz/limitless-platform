
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isApexDomain } from './utils/domainHelpers.ts'

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
}

// Set a session storage flag to prevent redirect loops
const hasRedirected = sessionStorage.getItem('apex_redirect_attempted');

// Redirect apex domain to www if needed, but only if we haven't tried redirecting before
if (isApexDomain() && !hasRedirected) {

  sessionStorage.setItem('apex_redirect_attempted', 'true');
  window.location.href = `https://www.limitlesslab.org${window.location.pathname}${window.location.search}`;
} else {
  // Mount React application — hydrate if react-snap pre-rendered the page,
  // otherwise do a normal client-side render.
  const container = document.getElementById("root")!;
  if (container.hasChildNodes()) {
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }

  // Clear the redirect flag after successful mount
  if (hasRedirected) {
    sessionStorage.removeItem('apex_redirect_attempted');
  }
}
