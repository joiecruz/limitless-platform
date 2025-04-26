
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect } from "react";
import { isAppSubdomain } from "@/utils/domainHelpers";

// Public/Marketing pages
import Index from "@/pages/Index";
import Product from "@/pages/landing/Product";
import Services from "@/pages/landing/Services";
import CoursesLanding from "@/pages/landing/Courses";
import ToolsLanding from "@/pages/landing/Tools";
import ToolDetail from "@/pages/landing/ToolDetail";
import Blog from "@/pages/landing/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudies from "@/pages/landing/CaseStudies";
import CaseStudy from "@/pages/CaseStudy";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// App pages
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
import EditCaseStudy from "@/pages/admin/case-studies/EditCaseStudy";

interface AppRoutesProps {
  session: Session | null;
}

const AppRoutes = ({ session }: AppRoutesProps) => {
  // Log routing information for debugging
  useEffect(() => {
    console.log("AppRoutes: Initializing with", {
      session: !!session,
      isAppSubdomain: isAppSubdomain(),
      hostname: window.location.hostname,
      pathname: window.location.pathname
    });
  }, [session]);

  return (
    <Routes>
      {/* Root path redirect based on authentication and domain */}
      <Route
        path="/"
        element={
          session ? 
            <Navigate to="/dashboard" replace /> : 
            (isAppSubdomain() ? <Navigate to="/dashboard" replace /> : <Index />)
        }
      />

      {/* Public/Marketing pages - only available on main domain */}
      {!isAppSubdomain() && (
        <>
          <Route path="/product" element={<Product />} />
          <Route path="/services" element={<Services />} />
          <Route path="/courses" element={<CoursesLanding />} />
          <Route path="/tools" element={<ToolsLanding />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
        </>
      )}

      {/* Auth routes - available on both domains */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<InvitePage />} />

      {/* Protected app routes */}
      <Route element={<RequireAuth>{session && <DashboardLayout />}</RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/dashboard/courses/:courseId/lessons" element={<Lessons />} />
        <Route path="/dashboard/tools" element={<Tools />} />
        <Route path="/dashboard/tools/:id" element={<ToolDetails />} />
        <Route path="/dashboard/community" element={<Community />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/account-settings" element={<AccountSettings />} />
      </Route>

      {/* Lesson routes - separate from dashboard layout */}
      <Route element={<RequireAuth>{session && <Outlet />}</RequireAuth>}>
        <Route path="/dashboard/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
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
        <Route path="/admin/blog/create" element={<CreateBlog />} />
        <Route path="/admin/content/blog/create" element={<CreateBlog />} />
        <Route path="/admin/content/blog/:id" element={<EditBlog />} />
        <Route path="/admin/content/case-studies/:id" element={<EditCaseStudy />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* 404 catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
