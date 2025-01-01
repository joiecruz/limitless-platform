import { Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Courses from "@/pages/Courses";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import BlogPost from "@/pages/BlogPost";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";

// Landing pages
import Product from "@/pages/landing/Product";
import Services from "@/pages/landing/Services";
import CoursesLanding from "@/pages/landing/Courses";
import ToolsLanding from "@/pages/landing/Tools";
import Blog from "@/pages/landing/Blog";
import CaseStudies from "@/pages/landing/CaseStudies";
import CaseStudy from "@/pages/CaseStudy";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminPages from "@/pages/admin/AdminPages";
import AdminContent from "@/pages/admin/AdminContent";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import AdminSettings from "@/pages/admin/AdminSettings";

interface AppRoutesProps {
  session: Session | null;
}

const AppRoutes = ({ session }: AppRoutesProps) => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<InvitePage />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/case-studies/:slug" element={<CaseStudy />} />

      {/* Landing/Website Pages */}
      <Route path="/product" element={<Product />} />
      <Route path="/services" element={<Services />} />
      <Route path="/courses" element={<CoursesLanding />} />
      <Route path="/tools" element={<ToolsLanding />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/case-studies" element={<CaseStudies />} />

      {/* Protected user routes */}
      <Route element={<RequireAuth>{session && <DashboardLayout />}</RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/dashboard/courses/:courseId/lessons" element={<Lessons />} />
        <Route path="/dashboard/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="/dashboard/tools" element={<Tools />} />
        <Route path="/dashboard/tools/:id" element={<ToolDetails />} />
        <Route path="/dashboard/community" element={<Community />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/account-settings" element={<AccountSettings />} />
      </Route>

      {/* Protected admin routes */}
      <Route element={<RequireAuth>{session && <AdminLayout />}</RequireAuth>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
        <Route path="/admin/workspaces/:workspaceId" element={<AdminWorkspaceDetails />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/content/blog/create" element={<CreateBlog />} />
        <Route path="/admin/content/blog/:id" element={<EditBlog />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
