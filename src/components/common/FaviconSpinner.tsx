import faviconSpinner from "@/assets/favicon-spinner.png";

interface FaviconSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FaviconSpinner({ size = "md", className = "" }: FaviconSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={faviconSpinner}
        alt="Loading"
        className={`${sizeClasses[size]} animate-spin-slow`}
        style={{ animationDuration: "1.5s" }}
      />
    </div>
  );
}
