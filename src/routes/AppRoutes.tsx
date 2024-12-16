import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Community from "@/pages/Community";
import Projects from "@/pages/Projects";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import { RequireAuth } from "@/components/auth/RequireAuth";

interface AppRoutesProps {
  session: Session | null;
}

const AppRoutes = ({ session }: AppRoutesProps) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={session ? "/dashboard" : "/signin"} replace />}
      />
      <Route
        path="/signin"
        element={session ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={session ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout>
              <Navigate to="/admin/dashboard" replace />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </RequireAuth>
        }
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
};

export default AppRoutes;
