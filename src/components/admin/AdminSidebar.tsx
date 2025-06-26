
import { NavLink, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Wrench, 
  Briefcase, 
  BookOpen, 
  Settings,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Workspaces", href: "/admin/workspaces", icon: Briefcase },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Master Trainers", href: "/admin/master-trainers", icon: GraduationCap },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col w-64 bg-white min-h-screen border-r border-gray-200">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <img
          className="h-8 w-auto"
          src="/limitless-logo.svg"
          alt="Limitless Lab"
        />
        <span className="ml-2 text-gray-900 font-semibold">Admin</span>
      </div>
      
      {/* Back to User Dashboard Button */}
      <div className="px-4 py-3 border-b border-gray-200">
        <Button
          onClick={handleBackToDashboard}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-3 h-4 w-4" />
          Back to User Dashboard
        </Button>
      </div>

      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
