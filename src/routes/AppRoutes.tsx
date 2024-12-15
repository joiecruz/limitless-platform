import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import VerifyEmail from "@/pages/VerifyEmail";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Billing from "@/pages/Billing";
import NotFound from "@/pages/NotFound";

interface AppRoutesProps {
  session: Session | null;
}

const AppRoutes = ({ session }: AppRoutesProps) => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signin"
        element={!session ? <SignIn /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={!session ? <SignUp /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/reset-password"
        element={!session ? <ResetPassword /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={session ? <Dashboard /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/settings"
        element={session ? <Settings /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/profile"
        element={session ? <Profile /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/billing"
        element={session ? <Billing /> : <Navigate to="/signin" replace />}
      />

      {/* Redirect root to dashboard or signin */}
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;