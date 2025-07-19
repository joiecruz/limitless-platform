import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HourOfCode() {
  const { hasMasterTrainerAccess, isLoading } = useMasterTrainerAccess();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/ai-ready-asean")}
          className="mb-4"
        >
          <span className="mr-2">←</span>
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">⏰ Hour of Code</h1>
        <p className="text-lg text-muted-foreground">Everything you need to conduct engaging Hour of Code sessions</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📋 Overview</TabsTrigger>
          <TabsTrigger value="guide">📄 Guide</TabsTrigger>
          <TabsTrigger value="activities">🎯 Activities</TabsTrigger>
          <TabsTrigger value="videos">🎥 Videos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📋 Hour of Code Overview</CardTitle>
              <CardDescription>Introduction to conducting Hour of Code sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">What is Hour of Code?</h3>
                <p className="text-muted-foreground mb-4">
                  Hour of Code is a global movement reaching tens of millions of students in 180+ countries. 
                  As part of AI Ready ASEAN, you'll be conducting AI-focused Hour of Code sessions to introduce 
                  participants to artificial intelligence concepts and coding fundamentals.
                </p>

                <h3 className="text-xl font-semibold mb-4">Your Goal</h3>
                <p className="text-muted-foreground mb-4">
                  As a Master Trainer, you're committed to reaching at least <strong>3,000 individuals</strong> 
                  through Hour of Code campaigns using Code.org tools and AI Ready ASEAN materials.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🎯 Session Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Introduce AI concepts in an accessible way</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Demystify artificial intelligence and coding</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Inspire interest in AI and technology careers</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Build confidence in digital literacy</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">👥 Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Students (elementary to high school)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Teachers and educators</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Community members of all ages</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span>•</span>
                          <span>Youth organizations and groups</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📄 Hour of Code Guide</CardTitle>
              <CardDescription>Step-by-step instructions for conducting successful sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Complete Guide Package</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Download the comprehensive Hour of Code guide with detailed instructions, timing, and facilitation tips.
                    </p>
                    <Button>
                      <span className="mr-2">📥</span>
                      Download Complete Guide (PDF)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">⏱️ Session Planning Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ready-to-use session plan template with timing, materials list, and facilitator notes.
                    </p>
                    <Button variant="outline">
                      <span className="mr-2">📋</span>
                      Download Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📝 Attendance & Report Forms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Pre-formatted forms for tracking attendance and collecting participant feedback.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">
                        <span className="mr-2">📋</span>
                        Attendance Sheet
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">📝</span>
                        Feedback Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Activities & Exercises</CardTitle>
              <CardDescription>Interactive activities for different learning environments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔌 Plugged Activities</CardTitle>
                    <Badge variant="outline">Requires Computers</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Computer-based activities using Code.org platforms and AI tools.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🤖</span>
                        <span>AI for Oceans (Code.org)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🎨</span>
                        <span>Machine Learning with Scratch</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>📸</span>
                        <span>Teachable Machine Activities</span>
                      </div>
                    </div>
                    <Button>
                      <span className="mr-2">📥</span>
                      Download Plugged Activities
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📱 Unplugged Activities</CardTitle>
                    <Badge variant="outline">No Computers Needed</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Hands-on activities that teach AI concepts without technology.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🧠</span>
                        <span>How AI Learns (Card Game)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🔍</span>
                        <span>Pattern Recognition Activities</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🎭</span>
                        <span>AI Ethics Role Play</span>
                      </div>
                    </div>
                    <Button>
                      <span className="mr-2">📥</span>
                      Download Unplugged Activities
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎮 Interactive Demos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Ready-to-use AI demonstrations and interactive experiences for your sessions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-medium">Quick Sort Demo</div>
                      <div className="text-sm text-muted-foreground">5 minutes</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🖼️</div>
                      <div className="font-medium">Image Recognition</div>
                      <div className="text-sm text-muted-foreground">10 minutes</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">💬</div>
                      <div className="font-medium">Chatbot Basics</div>
                      <div className="text-sm text-muted-foreground">15 minutes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎥 Tutorial Videos</CardTitle>
              <CardDescription>Video resources for preparation and facilitation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎬 Facilitator Training Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">How to Conduct Hour of Code</div>
                          <div className="text-sm text-muted-foreground">Duration: 15 minutes</div>
                        </div>
                        <Button size="sm">
                          <span className="mr-1">▶️</span>
                          Watch
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Managing Different Age Groups</div>
                          <div className="text-sm text-muted-foreground">Duration: 12 minutes</div>
                        </div>
                        <Button size="sm">
                          <span className="mr-1">▶️</span>
                          Watch
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Troubleshooting Common Issues</div>
                          <div className="text-sm text-muted-foreground">Duration: 8 minutes</div>
                        </div>
                        <Button size="sm">
                          <span className="mr-1">▶️</span>
                          Watch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📺 Participant Introduction Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Short videos to show participants at the beginning of your sessions.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">What is AI? (For Beginners)</div>
                          <div className="text-sm text-muted-foreground">Duration: 3 minutes</div>
                        </div>
                        <Button size="sm">
                          <span className="mr-1">▶️</span>
                          Watch
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">AI in Daily Life</div>
                          <div className="text-sm text-muted-foreground">Duration: 5 minutes</div>
                        </div>
                        <Button size="sm">
                          <span className="mr-1">▶️</span>
                          Watch
                        </Button>
                      </div>
                    </div>
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