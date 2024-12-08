import { useUser } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}