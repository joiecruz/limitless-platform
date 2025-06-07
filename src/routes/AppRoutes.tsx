import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Community } from "@/pages/Community";
import { Courses } from "@/pages/Courses";
import { Course } from "@/pages/Course";
import { Lesson } from "@/pages/Lesson";
import { Dashboard } from "@/pages/Dashboard";
import { Admin } from "@/pages/Admin";
import { NotFound } from "@/pages/NotFound";
import { Onboarding } from "@/pages/Onboarding";
import { InvitedUserOnboarding } from "@/pages/InvitedUserOnboarding";
import { Pricing } from "@/pages/Pricing";
import { Checkout } from "@/pages/Checkout";
import { Success } from "@/pages/Success";
import { Cancel } from "@/pages/Cancel";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Content } from "@/pages/admin/Content";
import { Users } from "@/pages/admin/Users";
import { CreateCourse } from "@/pages/admin/courses/CreateCourse";
import { EditCourse } from "@/pages/admin/courses/EditCourse";
import { CreateLesson } from "@/pages/admin/lessons/CreateLesson";
import { EditLesson } from "@/pages/admin/lessons/EditLesson";
import CreateToolkit from "@/pages/admin/toolkits/CreateToolkit";
import EditToolkit from "@/pages/admin/toolkits/EditToolkit";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/community" element={<Community />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<Course />} />
      <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/invited-user-onboarding" element={<InvitedUserOnboarding />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Content />} />
        <Route path="content" element={<Content />} />
        <Route path="users" element={<Users />} />
        <Route path="content/courses/create" element={<CreateCourse />} />
        <Route path="content/courses/edit/:id" element={<EditCourse />} />
        <Route path="content/lessons/create" element={<CreateLesson />} />
        <Route path="content/lessons/edit/:id" element={<EditLesson />} />
        <Route path="content/toolkits/create" element={<CreateToolkit />} />
        <Route path="content/toolkits/edit/:id" element={<EditToolkit />} />
      </Route>
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
