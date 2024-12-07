import { Routes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Courses from "@/pages/Courses";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";
import Community from "@/pages/Community";
import Projects from "@/pages/Projects";
import Tools from "@/pages/Tools";
import ToolDetails from "@/pages/ToolDetails";
import Settings from "@/pages/Settings";

interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={session ? "/dashboard" : "/signin"} replace />}
      />
      <Route
        path="/signin"
        element={session ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={session ? <Navigate to="/dashboard" replace /> : <SignUp />}
      />
      <Route
        path="/courses"
        element={
          <DashboardLayout>
            <Courses />
          </DashboardLayout>
        }
      />
      <Route
        path="/courses/:courseId/lessons"
        element={
          <DashboardLayout>
            <Lessons />
          </DashboardLayout>
        }
      />
      <Route
        path="/courses/:courseId/lessons/:lessonId"
        element={<Lesson />}
        handle={{ crumb: () => "Individual Lesson" }}
      />
      <Route
        path="/dashboard/*"
        element={
          session ? (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/projects"
        element={
          session ? (
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/tools"
        element={
          session ? (
            <DashboardLayout>
              <Tools />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/tools/:toolId"
        element={
          session ? (
            <DashboardLayout>
              <ToolDetails />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
        handle={{ crumb: () => "Individual Tool" }}
      />
      <Route
        path="/community"
        element={
          session ? (
            <DashboardLayout>
              <Community />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          session ? (
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
}