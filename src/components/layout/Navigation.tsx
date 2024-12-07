import { Home, BookOpen, Users, Settings, Download, Briefcase } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@supabase/auth-helpers-react";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Tools", href: "/tools", icon: Download },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  
  console.log("Current user data:", user);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <nav className="flex-1 space-y-1 px-3">
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
      
      {user && (
        <div className="mt-auto px-3 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-700 truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}