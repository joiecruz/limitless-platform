import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Community from "@/pages/Community";
import Projects from "@/pages/Projects";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import { RequireAuth } from "@/components/auth/RequireAuth";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  // Check if user is not logged in or email is not verified
  const isUnauthorized = !session || !session.user.email_confirmed_at;

  // If there's no session or email is not verified, only allow access to auth routes
  if (isUnauthorized) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // If there's a session and email is verified, allow access to protected routes
  return (
    <Routes>
      <Route
        path="/signin"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/lessons"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Lessons />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <RequireAuth>
            <Lesson />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/tools"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Tools />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/tools/:toolId"
        element={
          <RequireAuth>
            <DashboardLayout>
              <ToolDetails />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/community"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Community />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <RequireAuth>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/account-settings"
        element={
          <RequireAuth>
            <DashboardLayout>
              <AccountSettings />
            </DashboardLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}