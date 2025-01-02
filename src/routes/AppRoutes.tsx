import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import RequireAuth from "@/components/auth/RequireAuth";

// Landing pages
import Index from "@/pages/Index";
import Product from "@/pages/landing/Product";
import Services from "@/pages/landing/Services";
import Tools from "@/pages/landing/Tools";
import ToolDetail from "@/pages/landing/ToolDetail";
import Blog from "@/pages/landing/Blog";
import CaseStudies from "@/pages/landing/CaseStudies";
import Courses from "@/pages/landing/Courses";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// Auth pages
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";

// App pages
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Tools as AppTools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContent from "@/pages/admin/AdminContent";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminPages from "@/pages/admin/AdminPages";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import CourseDetails from "@/pages/admin/courses/CourseDetails";

interface Props {
  session: Session | null;
}

// Redirect component for app domain
const RedirectToMain = () => {
  const mainDomain = import.meta.env.VITE_MAIN_DOMAIN || "limitlesslab.org";
  window.location.href = `https://${mainDomain}${window.location.pathname}`;
  return null;
};

// Redirect component for main domain
const RedirectToApp = () => {
  const appDomain = import.meta.env.VITE_APP_DOMAIN || "app.limitlesslab.org";
  window.location.href = `https://${appDomain}${window.location.pathname}`;
  return null;
};

const AppRoutes = ({ session }: Props) => {
  const isAppDomain = window.location.hostname.startsWith('app.');
  
  // Routes for app subdomain
  if (isAppDomain) {
    return (
      <Routes>
        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/invite" element={<InvitePage />} />

        {/* Protected routes */}
        <Route element={<RequireAuth session={session} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tools" element={<AppTools />} />
          <Route path="/tools/:id" element={<ToolDetails />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:lessonId" element={<Lesson />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:courseId" element={<CourseDetails />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
          <Route path="/admin/workspaces/:id" element={<AdminWorkspaceDetails />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/blog/create" element={<CreateBlog />} />
          <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
        </Route>

        {/* Redirect marketing pages to main domain */}
        <Route path="/" element={<RedirectToMain />} />
        <Route path="/product" element={<RedirectToMain />} />
        <Route path="/services" element={<RedirectToMain />} />
        <Route path="/tools" element={<RedirectToMain />} />
        <Route path="/blog" element={<RedirectToMain />} />
        <Route path="/case-studies" element={<RedirectToMain />} />
        <Route path="/about" element={<RedirectToMain />} />
        
        {/* Catch all redirect - but only after checking other routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // Routes for main domain
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/product" element={<Product />} />
      <Route path="/services" element={<Services />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/:id" element={<ToolDetail />} />
      <Route path="/blog/*" element={<Blog />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Redirect auth and app pages to app domain */}
      <Route path="/signin" element={<RedirectToApp />} />
      <Route path="/signup" element={<RedirectToApp />} />
      <Route path="/dashboard/*" element={<RedirectToApp />} />
      <Route path="/admin/*" element={<RedirectToApp />} />
      
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;