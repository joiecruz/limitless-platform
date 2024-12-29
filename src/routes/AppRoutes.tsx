import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { Session } from "@supabase/supabase-js";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContent from "@/pages/admin/AdminContent";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import AdminSettings from "@/pages/admin/AdminSettings";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="content/blog/create" element={<CreateBlog />} />
        <Route path="content/blog/:id" element={<EditBlog />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}