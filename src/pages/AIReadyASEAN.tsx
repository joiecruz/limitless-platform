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
import ReactPlayer from "react-player";
import { ProgressDashboard } from "@/components/master-trainer/ProgressDashboard";
import { ReportingInstructions } from "@/components/master-trainer/ReportingInstructions";
import { TrainingReportForm } from "@/components/master-trainer/TrainingReportForm";

export default function AIReadyASEAN() {
  const { hasMasterTrainerAccess, isLoading } = useMasterTrainerAccess();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("welcome");
  const [searchQuery, setSearchQuery] = useState("");
  const [videoError, setVideoError] = useState(false);
  
  // Reporting state
  const [reportingView, setReportingView] = useState<'dashboard' | 'instructions' | 'form'>('dashboard');
  const [reportingSessionType, setReportingSessionType] = useState<'hour_of_code' | 'depth_training'>('hour_of_code');

  // FAQ data for filtering
  const faqData = [
    {
      id: "item-1",
      question: "Can we co-brand our materials and events with AI Ready ASEAN?",
      answer: "Yes. Co-branding is allowed as long as you strictly follow the official Communication and Branding Guidelines from the ASEAN Foundation. Make sure to: Use the approved logos of AI Ready ASEAN, ASEAN Foundation, and Google.org; Follow the correct logo placement and hierarchy in banners, posters, and slides; Use official hashtags: #AIReadyASEAN, #FutureReadyASEAN, #BeASEAN; Tag: @aseanfoundation, @google.org (Twitter only)"
    },
    {
      id: "item-2", 
      question: "Can we add our organization's logo to certificates?",
      answer: "No, your logo cannot be added alongside official program logos as these are already templated by ASEAN Foundation and Google.org"
    },
    {
      id: "item-3",
      question: "Where can we download the branding templates and logos?",
      answer: "You can access all communication assets in the Resources tab."
    },
    {
      id: "item-4",
      question: "What is my official title as a Master Trainer?",
      answer: "Your correct title is \"AI Ready ASEAN Master Trainer\". Please do not use \"ASEAN Foundation Master Trainer\" to avoid misrepresentation and confusion with the foundation's internal team and official staff."
    },
    {
      id: "item-5",
      question: "Can I run my trainings online?",
      answer: "Absolutely. You can conduct your sessions via Zoom, Google Meet, or Facebook Live—just make sure documentation is complete (attendance, photos/screenshots, pre/post assessments)."
    },
    {
      id: "item-6",
      question: "Can I combine audiences in one session?",
      answer: "Yes, mixed sessions are allowed. However, it's ideal to group learners by segment (Youth, Parents, Educators) to ensure the training is more relevant to their roles and needs."
    },
    {
      id: "item-7",
      question: "Are there any offline activities available for Hour of Code?",
      answer: "Yes. There are unplugged activities (worksheets and hands-on tasks) that don't require internet or computers. These are ideal for areas with limited connectivity and may be used as a last resort."
    },
    {
      id: "item-8",
      question: "What are the requirements for the attendance sheet?",
      answer: "You must collect the following information: Full Name, Mobile Number, Email (optional), Gender, Age Range, Beneficiary Type (Youth, Educator, Parent, Low Income, Person with Disability), Affiliation Type (e.g., school, NGO, LGU), Affiliation Name. For \"Low Income,\" participants may select \"Neither\" if they prefer not to declare. You may see the attendance sheet template in the Hour of Code materials in the dashboard."
    },
    {
      id: "item-9",
      question: "Can I use our own venue or training center?",
      answer: "Yes. You may host sessions at schools, barangay halls, or your own training venues—as long as it's accessible, safe, and appropriate."
    },
    {
      id: "item-10",
      question: "When is the deadline for the Hour of Code rollout?",
      answer: "The Hour of Code deadline has been extended to November 2025. This gives Master Trainers more flexibility to plan and conduct rollouts."
    },
    {
      id: "item-11",
      question: "What documentation is required?",
      answer: "Required documentation includes: Attendance sheets with required fields, Pre- and post-assessment forms, Event photos/screenshots, Brief narrative report, Publicity consent form (for any use of photos/videos)"
    },
    {
      id: "item-12",
      question: "Where can I get the publicity consent form?",
      answer: "You may download it in the Resources tab."
    },
    {
      id: "item-13",
      question: "Can participants use cell phones for Hour of Code activities?",
      answer: "Yes. Participants can use smartphones if no computers are available. However, the learning experience might be limited due to small screens and app/browser limitations."
    },
    {
      id: "item-14",
      question: "Can I charge participants a fee for attending the training or Hour of Code?",
      answer: "No. All AI Ready ASEAN trainings, including the Hour of Code, must be offered free of charge to participants. Charging a fee goes against the program's mission of inclusive and accessible AI education."
    },
    {
      id: "item-15",
      question: "Can I accept honoraria or tokens from host institutions?",
      answer: "Yes, you may accept honoraria or tokens if they are offered voluntarily by a school, LGU, or organization to support your time or effort. However, you must not require or expect payment from participants."
    }
  ];

  // Filter FAQs based on search query
  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reporting helper functions
  const handleStartReport = (type: 'hour_of_code' | 'depth_training') => {
    setReportingSessionType(type);
    setReportingView('instructions');
  };

  const handleShowForm = (type: 'hour_of_code' | 'depth_training') => {
    setReportingSessionType(type);
    setReportingView('form');
  };

  const handleBackToDashboard = () => {
    setReportingView('dashboard');
  };

  const handleBackToInstructions = () => {
    setReportingView('instructions');
  };

  const handleReportSubmitSuccess = () => {
    setReportingView('dashboard');
    // Reset to progress tab to show updated progress
    setActiveTab('reporting');
  };

  useEffect(() => {
    if (!isLoading && !hasMasterTrainerAccess) {
      navigate("/dashboard");
    }
  }, [hasMasterTrainerAccess, isLoading, navigate]);
  
  // Reset reporting view when tab changes
  useEffect(() => {
    if (activeTab !== 'reporting') {
      setReportingView('dashboard');
    }
  }, [activeTab]);

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
                    🔗 Quick Links & Shortcuts
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setActiveTab("materials")}
                    >
                      <div className="text-left">
                        <div className="flex items-center mb-1">
                          <span className="mr-2">📚</span>
                          <span className="font-medium">Training Materials</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Hour of Code & recordings</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setActiveTab("resources")}
                    >
                      <div className="text-left">
                        <div className="flex items-center mb-1">
                          <span className="mr-2">📥</span>
                          <span className="font-medium">Resources</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Templates & banners</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setActiveTab("reporting")}
                    >
                      <div className="text-left">
                        <div className="flex items-center mb-1">
                          <span className="mr-2">📊</span>
                          <span className="font-medium">Submit Reports</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Training documentation</p>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setActiveTab("community")}
                    >
                      <div className="text-left">
                        <div className="flex items-center mb-1">
                          <span className="mr-2">💬</span>
                          <span className="font-medium">Community</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Connect with trainers</p>
                      </div>
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
                          <td className="p-3">Launch of Master Trainer Dashboard and Hour of Code Modules</td>
                          <td className="p-3 text-muted-foreground">July 19, 2025</td>
                          <td className="p-3 text-muted-foreground">-</td>
                          <td className="p-3">
                            <Badge variant="outline">Training</Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('https://youtu.be/xNUYdwXfMaE?si=wBJlcKJLajpYxt6u&t=1', '_blank')}
                            >
                              <span className="mr-1">▶️</span>
                              Watch
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="p-3">Master Trainer Orientation</td>
                          <td className="p-3 text-muted-foreground">June 21, 2024</td>
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
            <CardContent className="space-y-8">
              {/* Communication Guidelines & Materials Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📢</span>
                  Communication Guidelines & Materials
                </h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📜</span>
                          <h4 className="text-lg font-semibold">Certificate of Authorization</h4>
                        </div>
                        <p className="text-muted-foreground">Apply for your official certificate confirming your status as an AI Ready ASEAN Master Trainer.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfNxevvA5v3_Bvpv3x8ld72d1mGPgDSDy-B8UHdE9Az0ztosg/viewform?usp=dialog', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">📝</span>
                        Apply for Certificate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🏷️</span>
                          <h4 className="text-lg font-semibold">Facebook Profile Badge</h4>
                        </div>
                        <p className="text-muted-foreground">Show your Master Trainer status with this official Facebook profile badge.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://www.canva.com/design/DAGtlY9Xnc4/11goxRIgx0dwROaBDs0xSQ/view?utm_content=DAGtlY9Xnc4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">🎨</span>
                        Get Profile Badge
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🎨</span>
                          <h4 className="text-lg font-semibold">Hour of Code Event Banner (4x3) - No External Partners</h4>
                        </div>
                        <p className="text-muted-foreground">Official banner template for Hour of Code events without external partners.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://www.canva.com/design/DAGtmvQdBGM/wFcoS3Fi2K51FivCrO3PwA/view?utm_content=DAGtmvQdBGM&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">🎨</span>
                        Access Banner
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🎨</span>
                          <h4 className="text-lg font-semibold">Hour of Code Event Banner (4x3) - With External Partners</h4>
                        </div>
                        <p className="text-muted-foreground">Official banner template for Hour of Code events with external partners.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://www.canva.com/design/DAGtm8zCGvg/QTmrx8a77XV7lo5hTnA-IA/view?utm_content=DAGtm8zCGvg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">🎨</span>
                        Access Banner
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Other Resources Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Other Resources
                </h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📊</span>
                          <h4 className="text-lg font-semibold">Attendance Sheet</h4>
                        </div>
                        <p className="text-muted-foreground">Track participant information and collect required data for reporting purposes.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/1W7lBLNerjb2KBkgfdasIFih_nOu7VyMFZh_EXVJfCME/edit?usp=sharing', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">📊</span>
                        Open Attendance Sheet
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🆔</span>
                          <h4 className="text-lg font-semibold">Master Trainer ID Template</h4>
                        </div>
                        <p className="text-muted-foreground">Official ID template for AI Ready ASEAN Master Trainers.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://www.canva.com/design/DAGtmzjtgU4/BB-VNLeIMYIDeABWpAm4yQ/view?utm_content=DAGtmzjtgU4&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">🆔</span>
                        Access Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Legal Docs Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">⚖️</span>
                  Legal Docs
                </h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📄</span>
                          <h4 className="text-lg font-semibold">MOU Template</h4>
                        </div>
                        <p className="text-muted-foreground">Memorandum of Understanding template for partnerships with schools and organizations.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://docs.google.com/document/d/1sT6WIAQcfw01v8XaLtBIDPVSYmx1U2lXVRpjLHHzLSw/edit?usp=sharing', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">📄</span>
                        Download MOU Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📋</span>
                          <h4 className="text-lg font-semibold">Publicity Consent & Release Form</h4>
                        </div>
                        <p className="text-muted-foreground">Required consent form for photo and video documentation during training sessions.</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => window.open('https://drive.google.com/file/d/1jFLlksHSFJuQzXYvuQbNZPkgUrkquGQM/view?usp=sharing', '_blank')}
                        className="ml-4"
                      >
                        <span className="mr-2">📋</span>
                        Download Form
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporting Tab */}
        <TabsContent value="reporting" className="space-y-6">
          {reportingView === 'dashboard' && (
            <ProgressDashboard onStartReport={handleStartReport} />
          )}
          
          {reportingView === 'instructions' && (
            <ReportingInstructions 
              onStartReport={handleShowForm}
              onBack={handleBackToDashboard}
            />
          )}
          
          {reportingView === 'form' && (
            <TrainingReportForm
              sessionType={reportingSessionType}
              onBack={handleBackToInstructions}
              onSubmitSuccess={handleReportSubmitSuccess}
            />
          )}
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
