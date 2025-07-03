import { Home, BookOpen, Users, Settings, Download, Briefcase, MessageSquare, Wrench, Lightbulb } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const navigationLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  {
    href: "/dashboard/challenges",
    icon: Lightbulb,
    label: "Design Challenges",
    description: "Collaborate on design thinking challenges"
  },
];

export function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="space-y-1 px-3 mb-6">
      {navigationLinks.map((item) => (
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
