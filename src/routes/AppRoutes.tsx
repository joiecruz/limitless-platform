import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupLayout } from "@/components/signup/SignupLayout";

// Auth pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminPages from "@/pages/admin/AdminPages";
import AdminContent from "@/pages/admin/AdminContent";
import AdminCreatePage from "@/pages/admin/AdminCreatePage";
import AdminEditPage from "@/pages/admin/AdminEditPage";

// Dashboard pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Courses from "@/pages/dashboard/Courses";
import Course from "@/pages/dashboard/Course";
import Lesson from "@/pages/dashboard/Lesson";
import Settings from "@/pages/dashboard/Settings";

// Signup pages
import SignupFlow from "@/pages/signup/SignupFlow";

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Signup flow */}
      <Route element={<SignupLayout />}>
        <Route path="/welcome" element={<SignupFlow />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="workspaces" element={<AdminWorkspaces />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="pages/new" element={<AdminCreatePage />} />
        <Route path="pages/:id/edit" element={<AdminEditPage />} />
        <Route path="content" element={<AdminContent />} />
      </Route>

      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<Course />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}