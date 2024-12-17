import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import Community from "@/pages/Community";
import Courses from "@/pages/Courses";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Projects from "@/pages/Projects";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminWorkspaces from "@/pages/admin/AdminWorkspaces";
import AdminWorkspaceDetails from "@/pages/admin/AdminWorkspaceDetails";
import AdminLayout from "@/components/admin/AdminLayout";
import { Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<InvitePage />} />
      
      <Route element={<RequireAuth><Outlet /></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId/lessons" element={<Lessons />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:toolId" element={<ToolDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="workspaces" element={<AdminWorkspaces />} />
          <Route path="workspaces/:id" element={<AdminWorkspaceDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}