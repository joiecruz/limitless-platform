import { Home, BookOpen, Users, Settings, Download, Briefcase } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Tools", href: "/tools", icon: Download },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="space-y-1 px-3 mb-6">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`nav-item ${location.pathname === item.href ? "active" : ""}`}
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