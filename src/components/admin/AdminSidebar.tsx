
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Wrench, 
  Briefcase, 
  BookOpen, 
  Settings,
  GraduationCap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Tools", href: "/admin/tools", icon: Wrench },
  { name: "Workspaces", href: "/admin/workspaces", icon: Briefcase },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Master Trainers", href: "/admin/master-trainers", icon: GraduationCap },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center h-16 px-4">
        <img
          className="h-8 w-auto"
          src="/limitless-logo.svg"
          alt="Limitless Lab"
        />
        <span className="ml-2 text-white font-semibold">Admin</span>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
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
