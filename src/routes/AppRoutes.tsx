import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { Pricing } from '@/pages/Pricing';
import { RequireAuth } from '@/components/auth/RequireAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import Community from '@/pages/Community';
import Tools from '@/pages/tools/Tools';
import Projects from '@/pages/projects/Projects';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { UpdatePassword } from '@/pages/UpdatePassword';
import { Profile } from '@/pages/Profile';
import { Admin } from '@/pages/Admin';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Article } from '@/pages/Article';
import { Articles } from '@/pages/Articles';
import DesignChallenges from "@/pages/DesignChallenges";
import ChallengeCollaboration from "@/pages/ChallengeCollaboration";

export function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="community" element={<Community />} />
          <Route path="tools" element={<Tools />} />
          <Route path="projects" element={<Projects />} />
          <Route path="profile" element={<Profile />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="articles/:slug" element={<Article />} />
           <Route path="articles" element={<Articles />} />
          <Route path="challenges" element={<DesignChallenges />} />
          <Route path="challenges/:id" element={<ChallengeCollaboration />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />

        {/* Catch All Route - redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
