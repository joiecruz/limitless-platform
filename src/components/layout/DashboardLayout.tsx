import { useState, createContext, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LoadingPage } from '@/components/common/LoadingPage';
import { useSessionValidation } from '@/hooks/useSessionValidation';
import { UserProfile } from './UserProfile';
import { ReportIssue } from '@/components/common/ReportIssue';
import { useIsMobile } from '@/hooks/use-mobile';

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
  // Add session validation
  useSessionValidation();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    () => {
      // Initialize from localStorage if available
      try {
        const savedWorkspace = localStorage.getItem(
          'limitless-current-workspace',
        );
        return savedWorkspace ? JSON.parse(savedWorkspace) : null;
      } catch {
        return null;
      }
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleWorkspaceChange = (workspace: Workspace) => {
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
      localStorage.setItem(
        'limitless-current-workspace',
        JSON.stringify(currentWorkspace),
      );
    } else {
      localStorage.removeItem('limitless-current-workspace');
    }
  }, [currentWorkspace]);

  // Persist current route if in community section
  useEffect(() => {
    if (location.pathname === '/dashboard/community') {
      localStorage.setItem('limitless-last-community-visit', 'true');
    } else if (
      location.pathname.startsWith('/dashboard/') &&
      location.pathname !== '/dashboard/community'
    ) {
      // Clear community flag when navigating to other dashboard pages
      localStorage.removeItem('limitless-last-community-visit');
    }
  }, [location.pathname]);

  // Restore community route on initial load if user was there before
  useEffect(() => {
    const wasInCommunity = localStorage.getItem(
      'limitless-last-community-visit',
    );
    const hasWorkspace = localStorage.getItem('limitless-current-workspace');
    const hasChannel = localStorage.getItem('limitless-active-channel');

    // Only auto-navigate to community if:
    // 1. User was previously in community
    // 2. We're currently on the root dashboard
    // 3. We have workspace and channel state to restore
    if (
      wasInCommunity &&
      hasWorkspace &&
      hasChannel &&
      location.pathname === '/dashboard'
    ) {
      navigate('/dashboard/community', { replace: true });
    }
  }, []); // Empty dependency array - only run on initial mount

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
    <WorkspaceContext.Provider
      value={{ currentWorkspace, setCurrentWorkspace: handleWorkspaceChange }}
    >
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
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3">
              <img
                src="/limitless-logo.svg"
                alt="Limitless Lab"
                className="h-9 w-auto"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pt-3 pb-2">
              <WorkspaceSelector
                currentWorkspace={currentWorkspace}
                setCurrentWorkspace={handleWorkspaceChange}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <Navigation />
            </div>
            <div className="mt-auto">
              <nav className="space-y-1 px-3 mb-3">
                <ReportIssue buttonClassName="nav-item" />
              </nav>
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:w-64 lg:flex-col">
          <div className="flex flex-col border-r border-gray-200 bg-white h-full">
            <div className="flex items-center px-6 py-3 flex-shrink-0">
              <img
                src="/limitless-logo.svg"
                alt="Limitless Lab"
                className="h-9 w-auto"
              />
            </div>
            <div className="px-4 pt-3 pb-2">
              <WorkspaceSelector
                currentWorkspace={currentWorkspace}
                setCurrentWorkspace={handleWorkspaceChange}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <Navigation />
            </div>
            <div className="mt-auto">
              <nav className="space-y-1 px-3 mb-3">
                <ReportIssue buttonClassName="nav-item" />
              </nav>
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col h-full">
          {location.pathname !== '/community' && (
            <div className="flex-shrink-0 lg:hidden">
              <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
            </div>
          )}
          <main className="flex-1 overflow-y-auto overflow-x-hidden"> {/* overflow-y-auto causing issues with width overflow*/}
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}
