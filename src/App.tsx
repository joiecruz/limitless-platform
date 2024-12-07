import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;