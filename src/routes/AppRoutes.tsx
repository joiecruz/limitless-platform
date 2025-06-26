
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";

// Landing pages
import LandingCourses from "@/pages/landing/Courses";
import CourseDetail from "@/pages/landing/CourseDetail";
import LandingTools from "@/pages/landing/Tools";
import ToolDetail from "@/pages/landing/ToolDetail";
import Services from "@/pages/landing/Services";
import Product from "@/pages/landing/Product";
import Blog from "@/pages/landing/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudies from "@/pages/landing/CaseStudies";
import CaseStudy from "@/pages/CaseStudy";
import WorkshopDetail from "@/pages/landing/WorkshopDetail";

// Dashboard pages
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Courses from "@/pages/Courses";
import Lesson from "@/pages/Lesson";
import Lessons from "@/pages/Lessons";
import Tools from "@/pages/Tools";
import DashboardToolDetail from "@/pages/DashboardToolDetail";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminContent from "@/pages/admin/AdminContent";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminCourses from "@/pages/admin/AdminCourses";
import CourseDetails from "@/pages/admin/courses/CourseDetails";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import EditCaseStudy from "@/pages/admin/case-studies/EditCaseStudy";
import AdminPages from "@/pages/admin/AdminPages";
import AdminMasterTrainers from "@/pages/admin/AdminMasterTrainers";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite/:token" element={<InvitePage />} />

      {/* Landing pages */}
      <Route path="/courses" element={<LandingCourses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/tools" element={<LandingTools />} />
      <Route path="/tool/:slug" element={<ToolDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/product" element={<Product />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/case-study/:slug" element={<CaseStudy />} />
      <Route path="/workshop/:id" element={<WorkshopDetail />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<Lessons />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="tools" element={<Tools />} />
        <Route path="tools/:slug" element={<DashboardToolDetail />} />
        <Route path="community" element={<Community />} />
        <Route path="settings" element={<Settings />} />
        <Route path="account" element={<AccountSettings />} />
      </Route>

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="workspaces" element={<AdminWorkspaces />} />
        <Route path="workspaces/:id" element={<AdminWorkspaceDetails />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="content/blog/create" element={<CreateBlog />} />
        <Route path="content/blog/:id/edit" element={<EditBlog />} />
        <Route path="content/case-studies/:id/edit" element={<EditCaseStudy />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="master-trainers" element={<AdminMasterTrainers />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
