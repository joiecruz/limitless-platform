
import { useEffect } from 'react';

/**
 * Hook to set the document title and restore it on unmount
 * @param title The title to set for the page
 * @param defaultTitle The default title to restore on unmount (optional)
 */
export function usePageTitle(title: string, defaultTitle: string = "Limitless Lab") {
  useEffect(() => {
    // Save the previous title
    const prevTitle = document.title;
    
    // Set the new title
    document.title = title;
    
    // Restore the previous title on unmount, or use defaultTitle if provided
    return () => {
      document.title = defaultTitle;
    };
  }, [title, defaultTitle]);
}
