import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Session } from "@supabase/supabase-js";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminPages from "@/pages/admin/AdminPages";
import AdminContent from "@/pages/admin/AdminContent";
import AdminCreatePage from "@/pages/admin/AdminCreatePage";
import AdminEditPage from "@/pages/admin/AdminEditPage";

interface AppRoutesProps {
  session: Session | null;
}

export function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin">
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="workspaces" element={<AdminWorkspaces />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/new" element={<AdminCreatePage />} />
          <Route path="pages/:id/edit" element={<AdminEditPage />} />
          <Route path="content" element={<AdminContent />} />
        </Route>
      </Route>

      {/* Redirect root to admin dashboard temporarily */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}