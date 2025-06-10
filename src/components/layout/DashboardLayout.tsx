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
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(() => {
    // Initialize from localStorage if available
    try {
      const savedWorkspace = localStorage.getItem('limitless-current-workspace');
      return savedWorkspace ? JSON.parse(savedWorkspace) : null;
    } catch {
      return null;
    }
  });
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

  // Persist workspace to localStorage when it changes
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem('limitless-current-workspace', JSON.stringify(currentWorkspace));
      console.log('Saved workspace to localStorage:', currentWorkspace);
    } else {
      localStorage.removeItem('limitless-current-workspace');
      console.log('Removed workspace from localStorage');
    }
  }, [currentWorkspace]);

  // Persist current route if in community section
  useEffect(() => {
    if (location.pathname === '/dashboard/community') {
      localStorage.setItem('limitless-last-community-visit', 'true');
      console.log('Marked community as last visited page');
    } else if (location.pathname.startsWith('/dashboard/') && location.pathname !== '/dashboard/community') {
      // Clear community flag when navigating to other dashboard pages
      localStorage.removeItem('limitless-last-community-visit');
      console.log('Cleared community visit flag - navigated to other page');
    }
  }, [location.pathname]);

  // Restore community route on initial load if user was there before
  useEffect(() => {
    const wasInCommunity = localStorage.getItem('limitless-last-community-visit');
    const hasWorkspace = localStorage.getItem('limitless-current-workspace');
    const hasChannel = localStorage.getItem('limitless-active-channel');

    // Only auto-navigate to community if:
    // 1. User was previously in community
    // 2. We're currently on the root dashboard
    // 3. We have workspace and channel state to restore
    if (wasInCommunity && hasWorkspace && hasChannel && location.pathname === '/dashboard') {
      console.log('Restoring community page from previous session');
      navigate('/dashboard/community', { replace: true });
    }
  }, []); // Empty dependency array - only run on initial mount

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
                src="/limitless-logo.svg"
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
                src="/limitless-logo.svg"
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
