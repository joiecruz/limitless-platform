import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  ArrowLeft,
  FileText,
  Database,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { UserProfile } from '@/components/layout/UserProfile';

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="h-full bg-white border-r flex flex-col overflow-y-auto">
      <div className="hidden md:flex items-center px-6 py-4">
        <img
          src="/limitless-logo.svg"
          alt="Limitless Lab"
          className="h-12 w-auto"
        />
      </div>
      <nav className="px-4 mt-6 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Link
            to="/admin"
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
          >
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link
            to="/admin/workspaces"
            className={`nav-item ${
              isActive('/admin/workspaces') ? 'active' : ''
            }`}
          >
            <Briefcase className="h-5 w-5" />
            Workspaces
          </Link>
          <Link
            to="/admin/courses"
            className={`nav-item ${isActive('/admin/courses') ? 'active' : ''}`}
          >
            <BookOpen className="h-5 w-5" />
            Courses
          </Link>
          <Link
            to="/admin/master-trainers"
            className={`nav-item ${isActive('/admin/master-trainers') ? 'active' : ''}`}
          >
            <GraduationCap className="h-5 w-5" />
            Master Trainers
          </Link>
          <Link
            to="/admin/reports"
            className={`nav-item ${isActive('/admin/reports') ? 'active' : ''}`}
          >
            <AlertCircle className="h-5 w-5" />
            Reports
          </Link>

          {/* Website section */}
          <div className="pt-4 border-t mt-4">
            <div className="text-sm font-medium text-gray-500 px-3 mb-2">
              Website
            </div>
            <Link
              to="/admin/pages"
              className={`nav-item ${isActive('/admin/pages') ? 'active' : ''}`}
            >
              <FileText className="h-5 w-5" />
              Pages
            </Link>
            <Link
              to="/admin/content"
              className={`nav-item ${
                isActive('/admin/content') ? 'active' : ''
              }`}
            >
              <Database className="h-5 w-5" />
              Content
            </Link>
          </div>
        </div>
      </nav>
      <div className="mt-auto border-t">
        <Link to="/dashboard" className="nav-item">
          <ArrowLeft className="h-5 w-5" />
          Go back to User Dashboard
        </Link>
      </div>
      <UserProfile />
    </aside>
  );
}
