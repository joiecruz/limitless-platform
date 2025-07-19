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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <img src="/limitless-logo.svg" alt="Limitless Lab" className="h-8" />
            <span className="text-2xl font-bold text-foreground">×</span>
            <div className="text-lg font-semibold text-muted-foreground">ASEAN Foundation × Google.org</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Ready ASEAN Master Trainer Dashboard</h1>
        <p className="text-lg text-muted-foreground mb-1">Access your training materials, submit your reports, and stay connected with your fellow Master Trainers here.</p>
        <p className="text-sm text-primary font-medium">Empowering your community, one AI hour at a time.</p>
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
                <span>Welcome, Master Trainer!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground">
                  Thank you for joining the AI Ready ASEAN initiative as a Master Trainer. Your role is crucial in bringing AI literacy to communities across Southeast Asia.
                </p>
                
                <div className="bg-muted p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-semibold mb-3">About AI Ready ASEAN</h3>
                  <p className="text-muted-foreground mb-4">
                    AI Ready ASEAN is a collaborative initiative between the ASEAN Foundation and Google.org, designed to democratize AI education across Southeast Asia. Through the Hour of Code and comprehensive training programs, we're building AI literacy from the ground up.
                  </p>
                  <p className="text-muted-foreground">
                    As a Master Trainer, you are empowered to conduct Hour of Code sessions, facilitate 12-hour training programs, and serve as a bridge between cutting-edge AI knowledge and your local community.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Conduct engaging Hour of Code sessions</li>
                        <li>Facilitate comprehensive 12-hour AI training programs</li>
                        <li>Build local AI literacy and awareness</li>
                        <li>Submit regular reports and documentation</li>
                        <li>Connect with fellow trainers across the region</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setActiveTab("materials")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Review Training Materials
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setActiveTab("resources")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Resources
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setActiveTab("community")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Join Community
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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