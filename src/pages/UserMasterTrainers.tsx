
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Wrench, Users, FileText, HelpCircle, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-left space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Ready Master Trainers
          </h1>
          <p className="text-lg text-gray-600">
            Manage your master trainer community, exclusive resources, and content.
          </p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl bg-gray-100">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="toolkit" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Toolkit</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Trainers' Directory</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to AI Ready Master Trainers</CardTitle>
                <CardDescription>
                  Your central hub for managing trainer resources and community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Trainers Directory</h3>
                        <p className="text-sm text-muted-foreground">Browse certified trainers</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <Wrench className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Toolkit</h3>
                        <p className="text-sm text-muted-foreground">Access training materials</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <HelpCircle className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Support</h3>
                        <p className="text-sm text-muted-foreground">Get help and FAQs</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toolkit">
            <div className="space-y-6">
              <UserMaterialsViewer />
              <UserRecordingsViewer />
            </div>
          </TabsContent>

          <TabsContent value="directory">
            <UserTrainersDirectory />
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  View training progress and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Reports and analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs">
            <UserFAQViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
