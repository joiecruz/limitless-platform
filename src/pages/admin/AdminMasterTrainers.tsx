
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Video, HelpCircle } from "lucide-react";
import { TrainersDirectory } from "@/components/admin/master-trainers/TrainersDirectory";
import { MaterialsManager } from "@/components/admin/master-trainers/MaterialsManager";
import { RecordingsManager } from "@/components/admin/master-trainers/RecordingsManager";
import { FAQManager } from "@/components/admin/master-trainers/FAQManager";

export default function AdminMasterTrainers() {
  const { is_superadmin, isLoading } = useGlobalRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!is_superadmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need superadmin privileges to access the Master Trainers module.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Ready Master Trainers</h1>
        <p className="text-muted-foreground">
          Manage your master trainer community, exclusive resources, and content.
        </p>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Trainers Directory
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="recordings" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Recordings
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <TrainersDirectory />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsManager />
        </TabsContent>

        <TabsContent value="recordings">
          <RecordingsManager />
        </TabsContent>

        <TabsContent value="faqs">
          <FAQManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
