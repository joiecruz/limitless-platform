import { UserProfile } from "@/components/layout/UserProfile";
import { Navigation } from "@/components/layout/Navigation";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { createContext, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType>({
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace }}>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader className="border-b">
              <div className="flex h-[60px] items-center px-6">
                <img
                  src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
                  alt="Limitless Lab"
                  className="h-8 w-auto"
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
            <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
            <div className="container mx-auto py-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </WorkspaceContext.Provider>
  );
}