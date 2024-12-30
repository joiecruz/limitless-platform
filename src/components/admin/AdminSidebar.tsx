import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Building2,
  Settings,
  Palette
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Page Builder", href: "/admin/page-builder", icon: Palette },
  { name: "Workspaces", href: "/admin/workspaces", icon: Building2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
            alt="Limitless Lab"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${location.pathname === item.href
                          ? "bg-gray-50 text-primary"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          location.pathname === item.href
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-primary"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}