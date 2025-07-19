import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { useMasterTrainerAccess } from "@/hooks/useMasterTrainerAccess";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AIReadyASEAN() {
  const { hasMasterTrainerAccess, isLoading } = useMasterTrainerAccess();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("welcome");
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ data for filtering
  const faqData = [
    {
      id: "item-1",
      question: "What is the AI Ready ASEAN Master Trainer program?",
      answer: "The AI Ready ASEAN Master Trainer program is a regional initiative led by the ASEAN Foundation, supported by Google.org, and implemented in the Philippines by Limitless Lab. Master Trainers are community leaders who conduct AI literacy training to reach underserved populations across Southeast Asia."
    },
    {
      id: "item-2", 
      question: "What are my responsibilities as a Master Trainer?",
      answer: "As a Master Trainer, you are committed to: Completing the 20-hour Training of Trainers (ToT), Conducting 12-hour AI literacy training for at least 600 learners, Leading Hour of Code campaigns for at least 3,000 individuals, Submitting complete documentation and reports, Upholding ethical AI education values"
    },
    {
      id: "item-3",
      question: "How do I access the Hour of Code materials?",
      answer: "You can access Hour of Code materials by clicking on the 'Training' tab above and then selecting 'Access Hour of Code' from the Hour of Code card. This will take you to comprehensive guides, activities, and tutorial videos."
    },
    {
      id: "item-4",
      question: "When will the 12-hour training modules be available?",
      answer: "The 12-hour in-depth training modules are currently under development by the ASEAN Foundation. This dashboard will be updated regularly as new materials become available. Please check back frequently for updates."
    },
    {
      id: "item-5",
      question: "How do I get my Master Trainer certificate?",
      answer: "You can apply for your official Certificate of Authorization by going to the 'Resources' tab and clicking 'Apply for Certificate.' This will take you to the application form where you can request your official certificate confirming your Master Trainer status."
    },
    {
      id: "item-6",
      question: "What is the performance-based incentive?",
      answer: "Master Trainers are eligible for a performance-based incentive of up to $300 upon successfully meeting all program commitments, including completing training requirements, reaching target learner numbers, and submitting required documentation."
    },
    {
      id: "item-7",
      question: "How do I join the Master Trainer Facebook group?",
      answer: "You can join our exclusive Master Trainer Facebook group by going to the 'Community' tab and clicking 'Join Facebook Group.' This private group connects you with fellow Master Trainers across ASEAN for support and experience sharing."
    },
    {
      id: "item-8",
      question: "Where do I submit my training reports?",
      answer: "The reporting system is currently under development. Once available, you'll be able to submit activity reports and track your progress through the 'Reporting' tab. Please check back soon for updates on this feature."
    },
    {
      id: "item-9",
      question: "What documentation do I need to submit?",
      answer: "You need to submit complete and accurate documentation including: Attendance sheets for all training sessions, Training reports with participant feedback, Photos from training activities, Feedback forms from participants, Hour of Code campaign documentation"
    },
    {
      id: "item-10",
      question: "Who can I contact for support?",
      answer: "If you need help or have questions about any aspect of the Master Trainer program, you can contact our support team at hello@limitlesslab.org. Our team is here to assist you throughout your Master Trainer journey."
    },
    {
      id: "item-11",
      question: "Can I lose my Master Trainer status?",
      answer: "Yes, failure to meet minimum targets or actions that harm the program's reputation may result in removal from the Master Trainer roster. It's important to maintain your commitments and uphold the values of ethical, inclusive, and responsible AI education."
    },
    {
      id: "item-12",
      question: "What is the MOU template for?",
      answer: "The MOU (Memorandum of Understanding) template is available in the Resources tab to help you formalize partnerships with schools, organizations, or communities where you'll be conducting your training sessions. This ensures clear expectations and professional collaboration."
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="welcome">👋 Welcome</TabsTrigger>
          <TabsTrigger value="materials">📚 Training</TabsTrigger>
          <TabsTrigger value="resources">📥 Resources</TabsTrigger>
          <TabsTrigger value="reporting">📊 Reporting</TabsTrigger>
          <TabsTrigger value="faqs">❓ FAQs</TabsTrigger>
          <TabsTrigger value="community">💬 Community</TabsTrigger>
        </TabsList>

        {/* Welcome Tab */}
        <TabsContent value="welcome" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
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
                      <span className="mr-2">📚</span>
                      Review Training Materials – Access guides, recordings, and Hour of Code content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resources")}
                    >
                      <span className="mr-2">📥</span>
                      Download Resources – Grab your certificates, ID templates, badges, and posters
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("community")}
                    >
                      <span className="mr-2">💬</span>
                      Join the Community – Connect with other Master Trainers and get support
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
              <CardTitle>📚 Training Materials & Recordings</CardTitle>
              <CardDescription>Access all your training resources and video content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hour of Code and 12-Hour Training - Two Columns */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <span>⏰ Hour of Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Access comprehensive Hour of Code materials including guides, activities, and tutorial videos to help you conduct engaging AI literacy sessions.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>📄</span>
                        <span>Hour of Code Guide & Activities</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🎥</span>
                        <span>Tutorial Videos</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>📁</span>
                        <span>Plugged & Unplugged Activities</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate("/dashboard/ai-ready-asean/hour-of-code")}
                    >
                      <span className="mr-2">🚀</span>
                      Access Hour of Code
                    </Button>
                  </CardContent>
                </Card>

                <Card className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <span>📚 12-Hour In-Depth Training Modules</span>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Comprehensive training modules covering AI literacy, ethics, and practical applications for conducting 12-hour training programs.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>📖</span>
                        <span>AI Literacy Fundamentals</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>⚖️</span>
                        <span>AI Ethics & Responsible Use</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>🛠️</span>
                        <span>Practical AI Applications</span>
                      </div>
                    </div>
                    <Button className="w-full" disabled>
                      <span className="mr-2">🔒</span>
                      Access Not Available Yet
                    </Button>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> In-depth modules are still under development by ASEAN Foundation. This page will be updated regularly as new materials become available.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Master Training Session Recordings - Table Format */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <span>🎬 Master Training Session Recordings</span>
                  </CardTitle>
                  <CardDescription>Access recordings from previous training sessions and orientations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Session Title</th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">Duration</th>
                          <th className="text-left p-3 font-semibold">Type</th>
                          <th className="text-left p-3 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="p-3">Master Trainer Orientation</td>
                          <td className="p-3 text-muted-foreground">December 2024</td>
                          <td className="p-3 text-muted-foreground">2 hours</td>
                          <td className="p-3">
                            <Badge variant="outline">Orientation</Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('https://www.youtube.com/watch?v=5lx4maW63Hk&list=PLYGRue6bgnXx1qDT53OYOEO8PmZm0wejS', '_blank')}
                            >
                              <span className="mr-1">▶️</span>
                              Watch
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📥 Resources & Templates</CardTitle>
              <CardDescription>Download official materials and templates for your training programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>📜 Certificate of Authorization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Apply for your official certificate confirming your status as an AI Ready ASEAN Master Trainer.</p>
                    <Button 
                      onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfNxevvA5v3_Bvpv3x8ld72d1mGPgDSDy-B8UHdE9Az0ztosg/viewform?usp=dialog', '_blank')}
                    >
                      <span className="mr-2">📝</span>
                      Apply for Certificate
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>🏷️ Facebook Profile Badge</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Show your Master Trainer status with this official Facebook profile badge.</p>
                    <Button 
                      onClick={() => window.open('https://www.canva.com/design/DAGtlY9Xnc4/11goxRIgx0dwROaBDs0xSQ/view?utm_content=DAGtlY9Xnc4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview', '_blank')}
                    >
                      <span className="mr-2">🎨</span>
                      Get Profile Badge
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>📄 MOU Template</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Memorandum of Understanding template for partnerships with schools and organizations.</p>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://docs.google.com/document/d/1sT6WIAQcfw01v8XaLtBIDPVSYmx1U2lXVRpjLHHzLSw/edit?usp=sharing', '_blank')}
                    >
                      <span className="mr-2">📄</span>
                      Download MOU Template
                    </Button>
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
              <CardTitle>📊 Reporting</CardTitle>
              <CardDescription>Submit activity reports and track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🚧</div>
                  <h3 className="text-xl font-semibold">Under Development</h3>
                  <p className="text-muted-foreground max-w-md">
                    The reporting system is currently being developed. Please check back soon for updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>❓ Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the Master Trainer program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Accordion */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {faq.id === "item-2" || faq.id === "item-9" ? (
                          <div className="space-y-2">
                            <p>{faq.answer.split(':')[0]}:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              {faq.answer.split(': ')[1]?.split(', ').map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>{faq.answer}</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                )}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>💬 Community</CardTitle>
              <CardDescription>Connect with fellow Master Trainers and stay updated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>👥 Private Facebook Group</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Join our exclusive Facebook group to connect with fellow Master Trainers across ASEAN, share experiences, and get support.</p>
                    <Button 
                      onClick={() => window.open('https://www.facebook.com/share/g/1AyKi2skYE/', '_blank')}
                    >
                      <span className="mr-2">💬</span>
                      Join Facebook Group
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📢 Latest Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No announcements at this time. Check back later for updates.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>🆘 Support Team</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Need help or have questions? Our support team is here to assist you with any aspect of the Master Trainer program.</p>
                    <Button 
                      onClick={() => window.open('mailto:hello@limitlesslab.org', '_blank')}
                    >
                      <span className="mr-2">💬</span>
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