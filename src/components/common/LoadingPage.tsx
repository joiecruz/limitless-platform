import { FaviconSpinner } from "./FaviconSpinner";

export function LoadingPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <FaviconSpinner size="lg" />
    </div>
  );
}