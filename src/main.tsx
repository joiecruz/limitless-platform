
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a timestamp to force cache refresh on browser loads
console.log('App initializing, build timestamp:', new Date().toISOString());

// Mount React application
createRoot(document.getElementById("root")!).render(<App />);
