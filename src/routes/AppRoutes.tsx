import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Courses from "@/pages/Courses";
import Course from "@/pages/Course";
import CourseLessons from "@/pages/CourseLessons";
import Tools from "@/pages/Tools";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminContent from "@/pages/admin/AdminContent";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminSettings from "@/pages/admin/AdminSettings";
import PageBuilder from "@/pages/admin/PageBuilder";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<Course />} />
          <Route path="/courses/:courseId/lessons" element={<CourseLessons />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="workspaces" element={<AdminWorkspaces />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="page-builder" element={<PageBuilder />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}