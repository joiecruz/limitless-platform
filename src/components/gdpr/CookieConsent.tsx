import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-fade-in z-50">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Cookie Consent
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              Essential cookies are always active as they are necessary for the website to function properly.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" onClick={handleDecline}>
              Decline Optional
            </Button>
            <Button onClick={handleAccept}>Accept All</Button>
          </div>
        </div>
      </div>
    </div>
  );
}