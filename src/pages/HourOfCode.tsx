import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">📋 Overview</TabsTrigger>
          <TabsTrigger value="resources">📦 Resources & Deck</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="overview">
              <AccordionTrigger className="text-xl font-semibold">
                📋 Hour of Code Overview
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-3">What is Hour of Code?</h3>
                    <p className="text-muted-foreground mb-4">
                      Hour of Code is a global movement reaching tens of millions of students in 180+ countries. 
                      As part of AI Ready ASEAN, you'll be conducting AI-focused Hour of Code sessions to introduce 
                      participants to artificial intelligence concepts and coding fundamentals.
                    </p>

                    <h3 className="text-lg font-semibold mb-3">Your Goal</h3>
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
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="step-by-step">
              <AccordionTrigger className="text-xl font-semibold">
                📝 Step-by-Step Guide
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">1️⃣ Pick Your Audience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Decide who you'll invite — students, parents, educators, or a mix.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">2️⃣ Choose a Date and Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Schedule a 1-hour session at your school or community. Online, offline, or hybrid all work!
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">3️⃣ Register as a Teacher on Code.org</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Create your account at code.org to track participants and assign activities.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">4️⃣ Select Your Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">
                          Pick an activity from Code.org catalog — examples:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>AI for Oceans (ethics & machine learning)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>Dance Party AI (fun and interactive)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>Unplugged activities (for low-tech areas)</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">5️⃣ Prepare Your Materials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Check if you'll need computers, internet, printed worksheets, or a projector. Prep certificates too!
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">6️⃣ Host the Hour of Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">Use this simple flow:</p>
                        <div className="space-y-2 text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Opening</Badge>
                            <span>5-10 mins</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Main Activity</Badge>
                            <span>25-45 mins</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Wrap-up & Reflection</Badge>
                            <span>5-10 mins</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">7️⃣ Document Your Event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Take clear photos, get group shots, and include action shots of the activity in progress.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">8️⃣ Collect Required Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">Record:</p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>Date & location</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>No. of participants (by age & gender)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>Type of event (online/offline)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>Type of activity (plugged/unplugged)</span>
                          </li>
                        </ul>
                        <p className="text-muted-foreground mt-3">
                          Use the provided <Button variant="link" className="p-0 h-auto text-primary">[reporting template]</Button>.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">9️⃣ Submit the Report</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Send your event report, attendance sheet, photos, and pre/post-assessment to the Limitless Lab team.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">🔟 Celebrate and Share!</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">
                          Post about your event on social media using:
                        </p>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">#AIReadyASEAN</Badge>
                            <Badge variant="secondary">#HourOfCode</Badge>
                            <Badge variant="secondary">#BeASEAN</Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Tag @aseanfoundation (FB/IG) and @googleorg (Twitter)
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

        {/* Presentation Decks Tab */}
        <TabsContent value="presentations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Presentation Decks</CardTitle>
              <CardDescription>Ready-to-use presentation materials for your Hour of Code sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎯 Main Session Presentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Complete presentation deck for facilitating your Hour of Code session, including intro slides, activity instructions, and wrap-up.
                    </p>
                    <div className="flex items-center justify-between p-3 border rounded-lg mb-4">
                      <div>
                        <div className="font-medium">Hour of Code Master Deck</div>
                        <div className="text-sm text-muted-foreground">PowerPoint • 45 slides</div>
                      </div>
                      <Button size="sm">
                        <span className="mr-1">📥</span>
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Google Slides Version</div>
                        <div className="text-sm text-muted-foreground">Interactive • Edit online</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <span className="mr-1">🔗</span>
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">👨‍🏫 Facilitator Presentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Presentation specifically designed for training other facilitators and explaining the Hour of Code concept to stakeholders.
                    </p>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Train-the-Trainer Deck</div>
                        <div className="text-sm text-muted-foreground">PowerPoint • 30 slides</div>
                      </div>
                      <Button size="sm">
                        <span className="mr-1">📥</span>
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🎨 Customizable Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Blank templates with AI Ready ASEAN branding that you can customize for specific audiences or contexts.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Elementary Template</div>
                          <div className="text-sm text-muted-foreground">Ages 6-12</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <span className="mr-1">📥</span>
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Secondary Template</div>
                          <div className="text-sm text-muted-foreground">Ages 13-18</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <span className="mr-1">📥</span>
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Adult Learners Template</div>
                          <div className="text-sm text-muted-foreground">18+ years</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <span className="mr-1">📥</span>
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Community Template</div>
                          <div className="text-sm text-muted-foreground">Mixed ages</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <span className="mr-1">📥</span>
                          Download
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