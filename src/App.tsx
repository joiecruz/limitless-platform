import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/gdpr/CookieConsent";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;