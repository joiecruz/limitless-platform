import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import ToolkitDetail from "@/pages/ToolkitDetail";
import Projects from "@/pages/Projects";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import NotFound from "@/pages/NotFound";
import Community from "@/pages/Community";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import LandingCourses from "@/pages/landing/Courses";
import LandingTools from "@/pages/landing/Tools";
import LandingToolDetail from "@/pages/landing/ToolDetail";
import Services from "@/pages/Services";
import Product from "@/pages/Product";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CaseStudies from "@/pages/CaseStudies";
import CaseStudy from "@/pages/CaseStudy";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminContent from "@/pages/admin/AdminContent";
import CreateBlog from "@/pages/admin/CreateBlog";
import EditBlog from "@/pages/admin/EditBlog";
import EditCaseStudy from "@/pages/admin/EditCaseStudy";
import AdminCourses from "@/pages/admin/AdminCourses";
import CourseDetails from "@/pages/admin/CourseDetails";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminPages from "@/pages/admin/AdminPages";
import AdminSettings from "@/pages/admin/AdminSettings";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudy />} />
        <Route path="/courses" element={<LandingCourses />} />
        <Route path="/tools" element={<LandingTools />} />
        <Route path="/tools/:id" element={<LandingToolDetail />} />
        <Route path="/tools/toolkit/:id" element={<ToolkitDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/product" element={<Product />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/tools" element={<Tools />} />
            <Route path="/dashboard/tools/:id" element={<ToolDetails />} />
            <Route path="/dashboard/tools/toolkit/:id" element={<ToolkitDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/courses/:id" element={<Courses />} />
            <Route path="/courses/:courseId/lessons" element={<Lessons />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<AccountSettings />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/content/blog/create" element={<CreateBlog />} />
            <Route path="/admin/content/blog/:id/edit" element={<EditBlog />} />
            <Route path="/admin/content/case-studies/:id/edit" element={<EditCaseStudy />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/:id" element={<CourseDetails />} />
            <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
            <Route path="/admin/workspaces/:id" element={<AdminWorkspaceDetails />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
