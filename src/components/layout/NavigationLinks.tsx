
import { Home, BookOpen, Users, Settings, Download, Briefcase } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <nav className="space-y-1 px-3 mb-6">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const link = (
          <a
            key={item.name}
            href={item.href}
            className={`nav-item group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary ${
              isActive ? "bg-gray-50 text-primary" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.href);
            }}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>{item.name}</span>
          </a>
        );

        return isCollapsed ? (
          <TooltipProvider key={item.name} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          link
        );
      })}
    </nav>
  );
}
