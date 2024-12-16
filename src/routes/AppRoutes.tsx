import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import InvitePage from "@/pages/InvitePage";
import Courses from "@/pages/Courses";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Settings from "@/pages/Settings";
import Community from "@/pages/Community";
import Dashboard from "@/pages/Dashboard";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";

const AppRoutes = ({ session }: { session: any }) => {
  return (
    <Routes>
      <Route
        path="/signin"
        element={!session ? <SignIn /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={!session ? <SignUp /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/forgot-password"
        element={!session ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />
      <Route
        path="/invite"
        element={<InvitePage />}
      />
      <Route
        path="/courses"
        element={<Courses />}
      />
      <Route
        path="/tools"
        element={<Tools />}
      />
      <Route
        path="/tools/:toolId"
        element={<ToolDetails />}
      />
      <Route
        path="/settings"
        element={<Settings />}
      />
      <Route
        path="/community"
        element={<Community />}
      />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route
        path="/lessons"
        element={<Lessons />}
      />
      <Route
        path="/lessons/:lessonId"
        element={<Lesson />}
      />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;
