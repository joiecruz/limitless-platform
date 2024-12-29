import { Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
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

// Admin pages
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

      {/* Protected routes */}
      <Route element={<RequireAuth>{session && <DashboardLayout />}</RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId/lessons" element={<Lessons />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:id" element={<ToolDetails />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account-settings" element={<AccountSettings />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="workspaces" element={<AdminWorkspaces />} />
          <Route path="workspaces/:workspaceId" element={<AdminWorkspaceDetails />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="content/blog/create" element={<CreateBlog />} />
          <Route path="content/blog/:id" element={<EditBlog />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;