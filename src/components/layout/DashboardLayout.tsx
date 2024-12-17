import { UserProfile } from "@/components/layout/UserProfile";
import { Navigation } from "@/components/layout/Navigation";
import { MobileHeader } from "@/components/layout/MobileHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { createContext, useState } from "react";
import { Workspace } from "../workspace/types";

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex h-[60px] items-center px-6">
            <img
              src="/lovable-uploads/440455ea-f8d0-4e60-bfc4-0c17bd3b1323.png"
              alt="Logo"
              className="h-8"
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Navigation />
        </SidebarContent>
        <SidebarFooter>
          <UserProfile />
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1">
        <MobileHeader onOpenSidebar={toggleSidebar} />
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace }}>
      <SidebarProvider defaultOpen>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </WorkspaceContext.Provider>
  );
}