import { Routes, Route } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Tools from "@/pages/Tools";
import DashboardToolDetail from "@/pages/DashboardToolDetail";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminTools from "@/pages/admin/AdminTools";
import RequireAdmin from "@/components/auth/RequireAdmin";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
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