import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Community from "@/pages/Community";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Projects from "@/pages/Projects";
import InvitePage from "@/pages/InvitePage";
import InviteConfirmPage from "@/pages/InviteConfirmPage";
import VerifyEmail from "@/pages/VerifyEmail";
import AccountSettings from "@/pages/AccountSettings";
import { Session } from "@supabase/supabase-js";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<InvitePage />} />
      <Route path="/invite/confirm" element={<InviteConfirmPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountSettings />
          </RequireAuth>
        }
      />
      <Route
        path="/community"
        element={
          <RequireAuth>
            <Community />
          </RequireAuth>
        }
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <Courses />
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/lessons"
        element={
          <RequireAuth>
            <Lessons />
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={
          <RequireAuth>
            <Lesson />
          </RequireAuth>
        }
      />
      <Route
        path="/tools"
        element={
          <RequireAuth>
            <Tools />
          </RequireAuth>
        }
      />
      <Route
        path="/tools/:toolId"
        element={
          <RequireAuth>
            <ToolDetails />
          </RequireAuth>
        }
      />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <Projects />
          </RequireAuth>
        }
      />
    </Routes>
  );
}