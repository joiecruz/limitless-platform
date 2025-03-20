
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force meta tags to refresh on load and log the timestamp
const forceRefreshMetaTags = () => {
  // Add timestamp to all image meta tags to bust cache
  const date = new Date().toISOString();
  console.log('App initializing, forcing meta refresh at:', date);
  
  // Force update of og:image with current timestamp
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    const content = ogImage.getAttribute('content') || '';
    const updatedContent = content.includes('?') 
      ? `${content.split('?')[0]}?_t=${date}` 
      : `${content}?_t=${date}`;
    ogImage.setAttribute('content', updatedContent);
    console.log('Updated og:image with new timestamp:', updatedContent);
  }
  
  // Force update of twitter:image with current timestamp
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    const content = twitterImage.getAttribute('content') || '';
    const updatedContent = content.includes('?') 
      ? `${content.split('?')[0]}?_t=${date}` 
      : `${content}?_t=${date}`;
    twitterImage.setAttribute('content', updatedContent);
    console.log('Updated twitter:image with new timestamp:', updatedContent);
  }
};

// Run on document load to force refresh meta tags
document.addEventListener('DOMContentLoaded', forceRefreshMetaTags);

// Also run after navigation events for single-page apps
if ('navigation' in window) {
  // @ts-ignore - Navigation API might not be fully supported in TypeScript yet
  window.navigation.addEventListener('navigate', () => {
    setTimeout(forceRefreshMetaTags, 500); // Small delay to ensure page has loaded
  });
}

// Mount React application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
