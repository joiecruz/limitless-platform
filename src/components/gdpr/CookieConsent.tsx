import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cookie Consent</DialogTitle>
          <DialogDescription>
            We use cookies to enhance your browsing experience and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">
            Essential cookies are always active as they are necessary for the website to function properly.
            Analytics cookies help us understand how you interact with our website.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDecline}>
            Decline Optional
          </Button>
          <Button onClick={handleAccept}>Accept All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}