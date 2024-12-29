import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { SiteLayout } from "@/layouts/SiteLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WorkspaceLayout } from "@/layouts/WorkspaceLayout";

// Site pages
import Home from "@/pages/Home";
import BlogPost from "@/pages/BlogPost";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContent from "@/pages/admin/AdminContent";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import AdminSettings from "@/pages/admin/AdminSettings";

// Workspace pages
import WorkspaceDashboard from "@/pages/workspace/WorkspaceDashboard";
import WorkspaceSettings from "@/pages/workspace/WorkspaceSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site routes */}
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="content/blog/create" element={<CreateBlog />} />
        <Route path="content/blog/:id" element={<EditBlog />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Workspace routes */}
      <Route path="/workspace" element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>}>
        <Route index element={<WorkspaceDashboard />} />
        <Route path="settings" element={<WorkspaceSettings />} />
      </Route>
    </Routes>
  );
}