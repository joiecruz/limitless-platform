
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
            AI Ready Master Trainers Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Use this dashboard to access your training modules, report activities, download facilitation tools, and track your progress.
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
                <CardTitle>👋 Welcome, Master Trainer!</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none space-y-6">
                <p>
                  You are now part of an exciting regional movement that empowers communities with AI literacy and responsible digital skills. As a Master Trainer, your leadership will help ensure that youth, parents, and educators across the Philippines—and Southeast Asia—can confidently understand and use AI in their daily lives.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    💡 About AI Ready ASEAN
                  </h3>
                  <p>
                    AI Ready ASEAN is a 2-year regional initiative led by the ASEAN Foundation and supported by Google.org. The project aims to equip 5.5 million learners across ASEAN with essential AI knowledge and skills for the future. In the Philippines, Limitless Lab is the official Local Implementing Partner.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-medium">The program focuses on:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>AI awareness and literacy campaigns</li>
                      <li>Training of Trainers (ToT) for educators and community leaders</li>
                      <li>In-depth AI courses for different target groups</li>
                      <li>Hour of Code campaigns to introduce AI and coding in fun, accessible ways</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    🎯 Your Mission as a Master Trainer
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">As a Master Trainer, you are expected to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Complete the 20-hour AI curriculum, designed to give you a strong foundation in AI concepts, ethics, and practical use.</li>
                      <li>Conduct a 12-hour AI training program for at least 600 learners in your community.</li>
                      <li>Lead or support Hour of Code events that reach at least 3,000 participants (combined online or offline).</li>
                      <li>Promote responsible AI use by sharing real-world applications and inspiring inclusive AI adoption.</li>
                      <li>Document and report your activities, ensuring that our collective impact is visible, measurable, and inspiring to others.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    🚀 Let's Get Started
                  </h3>
                  <p>
                    Head over to your learning modules, access facilitator resources, and begin planning your activities. You're not alone—we're here to support you every step of the way.
                  </p>
                  <p className="font-medium">
                    Together, we're building an AI-Ready Philippines. 🌏
                  </p>
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
