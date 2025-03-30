
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { MembersSettings } from "@/components/settings/MembersSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { useContext } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";

export default function Settings() {
  const { currentWorkspace } = useContext(WorkspaceContext);

  if (!currentWorkspace) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Please select a workspace to view settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6 px-4 md:px-0">
        <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="px-4 md:px-0 w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-4 md:p-6">
            <GeneralSettings />
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card className="p-4 md:p-6">
            <MembersSettings />
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card className="p-4 md:p-6">
            <BillingSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
