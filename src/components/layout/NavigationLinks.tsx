import { Home, BookOpen, Users, Settings, Download, Briefcase, Lightbulb, GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const masterTrainerNavigation = [
  { name: "AI Ready ASEAN", href: "/dashboard/ai-ready-asean", icon: GraduationCap },
];

export function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasMasterTrainerAccess } = useMasterTrainerAccess();

  // Insert AI Ready ASEAN after Community if user has access
  const getNavigationItems = () => {
    const items = [...navigation];
    if (hasMasterTrainerAccess) {
      const communityIndex = items.findIndex(item => item.name === "Community");
      if (communityIndex !== -1) {
        items.splice(communityIndex + 1, 0, ...masterTrainerNavigation);
      }
    }
    return items;
  };

  return (
    <nav className="space-y-1 px-3 mb-6">
      {getNavigationItems().map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`nav-item ${location.pathname === item.href || location.pathname.startsWith(item.href + "/") ? "active" : ""}`}
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