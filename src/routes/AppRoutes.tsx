import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

interface AppRoutesProps {
  session: Session | null;
}

const AppRoutes = ({ session }: AppRoutesProps) => {
  // Check if we're on the app subdomain
  const isAppDomain = window.location.hostname === 'app.limitlesslab.org';

  // Create redirect components
  const RedirectToMain = () => {
    const mainUrl = window.location.href.replace('app.limitlesslab.org', 'limitlesslab.org');
    window.location.href = mainUrl;
    return null;
  };

  const RedirectToApp = () => {
    const appUrl = window.location.href.replace('limitlesslab.org', 'app.limitlesslab.org');
    window.location.href = appUrl;
    return null;
  };

  if (isAppDomain) {
    return (
      <Routes>
        {/* Auth routes */}
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

        {/* Redirect marketing pages to main domain */}
        <Route path="/" element={<RedirectToMain />} />
        <Route path="/product" element={<RedirectToMain />} />
        <Route path="/services" element={<RedirectToMain />} />
        <Route path="/courses" element={<RedirectToMain />} />
        <Route path="/tools" element={<RedirectToMain />} />
        <Route path="/blog" element={<RedirectToMain />} />
        <Route path="/case-studies" element={<RedirectToMain />} />
        <Route path="/about" element={<RedirectToMain />} />
      </Routes>
    );
  }

  // Main website routes (limitlesslab.org)
  return (
    <Routes>
      <Route path="/" element={<Index />} />
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

      {/* Redirect auth and app routes to app subdomain */}
      <Route path="/signin" element={<RedirectToApp />} />
      <Route path="/signup" element={<RedirectToApp />} />
      <Route path="/dashboard/*" element={<RedirectToApp />} />
      <Route path="/admin/*" element={<RedirectToApp />} />
    </Routes>
  );
};

export default AppRoutes;