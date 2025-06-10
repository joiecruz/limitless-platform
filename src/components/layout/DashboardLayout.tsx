import { useState, createContext, useEffect } from "react";
import { X } from "lucide-react";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { Navigation } from "./Navigation";
import { MobileHeader } from "./MobileHeader";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { LoadingPage } from "@/components/common/LoadingPage";

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
});

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleWorkspaceChange = (workspace: Workspace) => {
    console.log('Changing workspace to:', workspace);
    setIsLoading(true);
    setCurrentWorkspace(workspace);

    // Redirect to the same route but with the new workspace context
    const currentPath = location.pathname;
    navigate(currentPath, { replace: true });

    // Add a small delay to ensure loading state is visible
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Log workspace changes
  useEffect(() => {
    console.log('Current workspace in DashboardLayout:', currentWorkspace);
  }, [currentWorkspace]);

  // Prevent page scrolling globally
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace: handleWorkspaceChange }}>
      <div className="fixed inset-0 bg-gray-50 overflow-hidden">
        {isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50">
            <LoadingPage />
          </div>
        )}

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
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                alt="Limitless Lab"
                className="h-12 w-auto"
              />
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 flex-1 overflow-y-auto">
              <div className="mb-6">
                <WorkspaceSelector
                  currentWorkspace={currentWorkspace}
                  setCurrentWorkspace={handleWorkspaceChange}
                />
              </div>
              <Navigation />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-64 lg:flex-col">
          <div className="flex flex-col border-r border-gray-200 bg-white h-full">
            <div className="flex items-center px-6 py-4 flex-shrink-0">
              <img
                src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                alt="Limitless Lab"
                className="h-12 w-auto"
              />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <WorkspaceSelector
                    currentWorkspace={currentWorkspace}
                    setCurrentWorkspace={handleWorkspaceChange}
                  />
                </div>
                <Navigation />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col h-full">
          {location.pathname !== '/community' && (
            <div className="flex-shrink-0">
              <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
            </div>
          )}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}
