
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Video, HelpCircle, Lock } from "lucide-react";
import { UserTrainersDirectory } from "@/components/user/master-trainers/UserTrainersDirectory";
import { UserMaterialsViewer } from "@/components/user/master-trainers/UserMaterialsViewer";
import { UserRecordingsViewer } from "@/components/user/master-trainers/UserRecordingsViewer";
import { UserFAQViewer } from "@/components/user/master-trainers/UserFAQViewer";

export default function UserMasterTrainers() {
  const { hasMasterTrainerAccess, isLoading } = useMasterTrainerAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasMasterTrainerAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gray-300 rounded-full">
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-700">
                AI Ready Master Trainers
              </h1>
            </div>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Access Required</CardTitle>
                <CardDescription>
                  You need master trainer access to view this content. Please contact an administrator to request access.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Ready Master Trainers
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access exclusive resources, connect with expert trainers, and accelerate your innovation journey.
          </p>
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Trainers</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Materials</span>
            </TabsTrigger>
            <TabsTrigger value="recordings" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Recordings</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory">
            <UserTrainersDirectory />
          </TabsContent>

          <TabsContent value="materials">
            <UserMaterialsViewer />
          </TabsContent>

          <TabsContent value="recordings">
            <UserRecordingsViewer />
          </TabsContent>

          <TabsContent value="faqs">
            <UserFAQViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
