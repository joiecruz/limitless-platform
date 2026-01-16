import { Home, BookOpen, Settings, Download, Briefcase, GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const masterTrainerNavigation = [
  { name: "AI Ready ASEAN", href: "/dashboard/ai-ready-asean", icon: GraduationCap },
];

export function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasMasterTrainerAccess } = useMasterTrainerAccess();

  // Add AI Ready ASEAN after Tools if user has access
  const getNavigationItems = () => {
    const items = [...navigation];
    if (hasMasterTrainerAccess) {
      const toolsIndex = items.findIndex(item => item.name === "Tools");
      if (toolsIndex !== -1) {
        items.splice(toolsIndex + 1, 0, ...masterTrainerNavigation);
      }
    }
    return items;
  };

  const isActive = (href: string) => {
    // Exact match for Dashboard to prevent it from matching all /dashboard/* routes
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    // For other routes, match exact or child routes
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <nav className="space-y-1 px-3 mb-6">
      {getNavigationItems().map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`nav-item ${isActive(item.href) ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(item.href);
          }}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </a>
      ))}
    </nav>
  );
}