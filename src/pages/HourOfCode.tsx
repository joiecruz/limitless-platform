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

        {/* Resources & Deck Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📦 Resources & Deck</CardTitle>
              <CardDescription>Essential materials to facilitate Hour of Code sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Facilitator's Deck</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Complete presentation slides to guide your Hour of Code session with AI activities and concepts.
                    </p>
                    <Button 
                      onClick={() => window.open('https://docs.google.com/presentation/d/10IMj0ZgRTjOOAfNafgB_g9FELoxcyAFVoi1aagOr3zE/edit?usp=sharing', '_blank')}
                    >
                      <span className="mr-2">📊</span>
                      Open Facilitator's Deck
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">✉️ Letter of Invitation / Partnership Request</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Template letter to invite schools and organizations to participate in Hour of Code events.
                    </p>
                    <Button variant="outline">
                      <span className="mr-2">📄</span>
                      Download Invitation Letter
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📱 Social Media Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Ready-to-use graphics for promoting your Hour of Code events on social media platforms.
                    </p>
                    <Button variant="outline">
                      <span className="mr-2">🎨</span>
                      Download Social Media Pack
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📋 Attendance Sheet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Track participant information and collect required data for reporting purposes.
                    </p>
                    <Button variant="outline">
                      <span className="mr-2">📊</span>
                      Download Attendance Sheet
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