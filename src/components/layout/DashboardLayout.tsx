import { useState } from "react";
import { Menu, X, ChevronDown, Home, Briefcase, BookOpen, Download, Users, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const workspaces = [
  { id: 1, name: "Personal Workspace" },
  { id: 2, name: "Team Alpha" },
  { id: 3, name: "Innovation Hub" },
];

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Tools", href: "/dashboard/tools", icon: Download },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <span className="text-xl font-semibold text-primary-600">Limitless Lab</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="workspace-select w-full">
                  <span className="truncate">{currentWorkspace.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => setCurrentWorkspace(workspace)}
                    >
                      {workspace.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <span className="text-primary-600">+ Create Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <nav className="space-y-1 px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`nav-item ${location.pathname === item.href ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r border-gray-200 bg-white">
          <div className="flex items-center px-6 py-6">
            <span className="text-xl font-semibold text-primary-600">Limitless Lab</span>
          </div>
          <div className="flex-1">
            <div className="px-4 pb-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="workspace-select w-full">
                  <span className="truncate">{currentWorkspace.name}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => setCurrentWorkspace(workspace)}
                    >
                      {workspace.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <span className="text-primary-600">+ Create Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <nav className="space-y-1 px-3">
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
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-between px-4">
            <span className="text-xl font-semibold text-primary-600">Limitless Lab</span>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}