import { Routes, Route, Outlet } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Projects from "@/pages/Projects";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCourses from "@/pages/admin/AdminCourses";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import { Session } from "@supabase/supabase-js";

// Import website pages
import Home from "@/pages/website/Home";
import Product from "@/pages/website/Product";
import Services from "@/pages/website/Services";
import Blog from "@/pages/website/Blog";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      {/* Website routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />

      {/* Auth routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<InvitePage />} />

      {/* Admin routes */}
      <Route element={<RequireAuth><AdminLayout><Outlet /></AdminLayout></RequireAuth>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
        <Route path="/admin/workspaces/:id" element={<AdminWorkspaceDetails />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
      </Route>

      {/* Dashboard routes */}
      <Route element={<RequireAuth><DashboardLayout><Outlet /></DashboardLayout></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId/lessons" element={<Lessons />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:toolId" element={<ToolDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Route>

      {/* Individual lesson page outside DashboardLayout */}
      <Route 
        path="/courses/:courseId/lessons/:lessonId" 
        element={<RequireAuth><Lesson /></RequireAuth>} 
      />
    </Routes>
  );
}