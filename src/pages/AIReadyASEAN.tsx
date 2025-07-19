import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Play, FileText, Image, MessageSquare, Upload, BarChart3, Users } from "lucide-react";
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AIReadyASEAN() {
  const { hasMasterTrainerAccess, isLoading } = useMasterTrainerAccess();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("welcome");

  useEffect(() => {
    if (!isLoading && !hasMasterTrainerAccess) {
      navigate("/dashboard");
    }
  }, [hasMasterTrainerAccess, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasMasterTrainerAccess) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Banner */}
      <div className="mb-8">
        <img 
          src="/lovable-uploads/bf7bd478-d4e1-4f6c-94e5-0c615cef8ccd.png" 
          alt="AI Ready ASEAN Master Trainers Dashboard" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Master Trainer Dashboard</h1>
        <p className="text-lg text-muted-foreground">Access your training materials, submit your reports, and stay connected with your fellow Master Trainers here.</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="materials">Training Materials</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Welcome Tab */}
        <TabsContent value="welcome" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>👋 Welcome, Master Trainer!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground">
                  Congratulations on being selected as a Master Trainer for the AI Ready ASEAN – Philippines program! Your role is vital in building AI literacy from the ground up—especially in communities that need it most.
                </p>
                
                <p className="text-muted-foreground">
                  This dashboard will serve as your central hub for everything you need throughout your journey.
                </p>
                
                <div className="bg-muted p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-semibold mb-3">About AI Ready ASEAN</h3>
                  <p className="text-muted-foreground mb-4">
                    AI Ready ASEAN is a regional initiative led by the ASEAN Foundation, supported by Google.org, and implemented in the Philippines by Limitless Lab. Together, we aim to empower 5.5 million people across Southeast Asia with essential AI skills and knowledge.
                  </p>
                  <p className="text-muted-foreground">
                    As a Master Trainer, you are part of a growing community of changemakers leading AI education in the region.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    🌏 Your Responsibilities
                  </h3>
                  <p className="text-muted-foreground mb-4">As a Master Trainer, you have committed to:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <span className="text-muted-foreground">Completing the 20-hour Training of Trainers (ToT) on AI literacy, ethics, and applications</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <span className="text-muted-foreground">Conducting a 12-hour AI literacy training reaching at least 600 learners</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <span className="text-muted-foreground">Leading the Hour of Code campaign, helping reach at least 3,000 individuals using Code.org tools</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <div className="text-muted-foreground">
                        <div>Submitting complete and accurate documentation:</div>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Attendance sheets</li>
                          <li>Training reports</li>
                          <li>Photos and feedback forms</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <span className="text-muted-foreground">Upholding the values of ethical, inclusive, and responsible AI education</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-green-600 font-semibold">✅</span>
                      <span className="text-muted-foreground">Maintaining regular communication with the Limitless Lab team and participating in coordination activities</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-800">
                    ⚠️ Important Notes
                  </h3>
                  <div className="space-y-3 text-sm text-yellow-800">
                    <p>This is a volunteer-based leadership role, not an employment contract.</p>
                    <p>You are eligible for a performance-based incentive of up to $300 upon meeting your commitments.</p>
                    <p>Failure to meet minimum targets or actions that harm the program's reputation may result in removal from the Master Trainer roster.</p>
                    <p>By joining, you allow Limitless Lab and ASEAN Foundation to document and showcase your participation with proper credit.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    🚀 Get Started
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("materials")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      📚 Review Training Materials – Access guides, recordings, and Hour of Code content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resources")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      📥 Download Resources – Grab your certificates, ID templates, badges, and posters
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("community")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      💬 Join the Community – Connect with other Master Trainers and get support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Materials & Recordings</CardTitle>
              <CardDescription>Access all your training resources and video content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Hour of Code Guide</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Complete guide for conducting Hour of Code sessions with step-by-step instructions and activity summaries.</p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Hour of Code Tutorial Videos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Watch comprehensive tutorials on how to facilitate engaging Hour of Code sessions.</p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Tutorials
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Activity Playlists</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Download both plugged and unplugged activity playlists for different learning environments.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Plugged Activities
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Unplugged Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Master Trainer Orientation Recording</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Replay the Master Trainer Orientation session to refresh your knowledge and understanding.</p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Recording
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>In-Depth Training Modules</span>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Advanced training module slides and materials for comprehensive AI education programs.</p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> In-depth modules are still under development by ASEAN Foundation. This page will be updated regularly as new materials become available.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resources & Templates</CardTitle>
              <CardDescription>Download official materials and templates for your training programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Certificate of Authorization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Official certificate confirming your status as an AI Ready ASEAN Master Trainer.</p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Image className="h-5 w-5" />
                      <span>Facebook Profile Badge</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Show your Master Trainer status with this official Facebook profile badge.</p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Badge
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>ID and Letter Templates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Customizable templates for official identification and correspondence.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        ID Template
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Letter Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Image className="h-5 w-5" />
                      <span>Posters and Slide Decks</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Professional marketing materials and presentation templates for your training sessions.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Event Posters
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Slide Decks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporting Tab */}
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporting</CardTitle>
              <CardDescription>Submit activity reports and track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Activity Reports</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Submit reports for your Hour of Code sessions and 12-hour training programs.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Hour of Code Report
                      </Button>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit 12-Hour Training Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Documentation Upload</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Upload photos, attendance lists, and other supporting documentation from your training sessions.</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documentation
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Progress Tracking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Monitor your completion progress and targets for the AI Ready ASEAN program.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-sm text-muted-foreground">Hour of Code Sessions</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-sm text-muted-foreground">12-Hour Programs</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-sm text-muted-foreground">Participants Reached</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>Connect with fellow Master Trainers and stay updated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Private Facebook Group</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Join our exclusive Facebook group to connect with fellow Master Trainers across ASEAN, share experiences, and get support.</p>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Join Facebook Group
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Latest Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <div className="font-medium">Welcome to the AI Ready ASEAN Master Trainer Program!</div>
                        <div className="text-sm text-muted-foreground">December 2024</div>
                        <p className="text-muted-foreground mt-2">We're excited to have you on board. Check out the training materials and don't hesitate to reach out if you need support.</p>
                      </div>
                      <div className="border-l-4 border-muted pl-4">
                        <div className="font-medium">New Resources Available</div>
                        <div className="text-sm text-muted-foreground">Coming Soon</div>
                        <p className="text-muted-foreground mt-2">Additional training materials and resources will be added regularly. Stay tuned for updates.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Support Team</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Need help or have questions? Our support team is here to assist you with any aspect of the Master Trainer program.</p>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}