import { Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Tools from "@/pages/Tools";
import DashboardToolDetail from "@/pages/DashboardToolDetail";
import Landing from "@/pages/landing/Landing";
import About from "@/pages/landing/About";
import Contact from "@/pages/landing/Contact";
import Pricing from "@/pages/landing/Pricing";
import LandingTools from "@/pages/landing/Tools";
import LandingToolDetail from "@/pages/landing/ToolDetail";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ConfirmEmail from "@/pages/auth/ConfirmEmail";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminTools from "@/pages/admin/Tools";
import RequireAdmin from "@/components/auth/RequireAdmin";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/tools" element={<LandingTools />} />
      <Route path="/tools/:id" element={<LandingToolDetail />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/tools" element={<Tools />} />
          <Route path="/dashboard/tools/:id" element={<DashboardToolDetail />} />
          <Route path="/dashboard/courses" element={<Dashboard />} />
          <Route path="/dashboard/community" element={<Dashboard />} />
          <Route path="/dashboard/projects" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<Dashboard />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/tools" element={<AdminTools />} />
        </Route>
      </Route>
    </Routes>
  );
}