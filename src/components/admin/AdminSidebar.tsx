import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BookOpen,
  ArrowLeft,
  Globe,
  FileText,
  Database,
  BookMarked
} from "lucide-react";
import { UserProfile } from "@/components/layout/UserProfile";

export function AdminSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col fixed">
      <div className="flex items-center px-6 py-4">
        <img 
          src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
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
            className={`nav-item ${isActive('/admin/workspaces') ? 'active' : ''}`}
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
              className={`nav-item ${isActive('/admin/content') ? 'active' : ''}`}
            >
              <Database className="h-5 w-5" />
              Content
            </Link>
            <Link 
              to="/admin/case-studies" 
              className={`nav-item ${isActive('/admin/case-studies') ? 'active' : ''}`}
            >
              <BookMarked className="h-5 w-5" />
              Case Studies
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