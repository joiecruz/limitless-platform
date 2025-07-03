import { useState, useEffect } from "react";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard, ProjectCardProps } from "@/components/projects/ProjectCard";
import { ProjectBanner } from "@/components/projects/ProjectBanner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateChallengeDialog } from "@/components/challenges/CreateChallengeDialog";
import { useDesignChallenges } from "@/hooks/useDesignChallenges";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Briefcase, Plus, Trash2, Lightbulb } from "lucide-react";
import { ProjectNavBar } from "@/components/projects/ProjectNavBar";
import { Routes, Route, useNavigate } from "react-router-dom";
import SearchHeader from "@/components/tools/SearchHeader";
import { DesignChallenge, ChallengeStatus } from "@/types/designChallenge";
import { format } from 'date-fns';

export default function Projects() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showCreateChallengeDialog, setShowCreateChallengeDialog] = useState(false);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [showDesignThinkingPage, setShowDesignThinkingPage] = useState(false);
  const navigate = useNavigate();
  const { data: workspace } = useCurrentWorkspace();
  const { workspaceId, userRole, currentUserId } = workspace || {};
  const { challenges, loading: challengesLoading, createChallenge, updateChallengeStatus, deleteChallenge } = useDesignChallenges(workspaceId);

  const canManageStatus = userRole === 'admin' || userRole === 'owner';
  
  const canDelete = (challenge: DesignChallenge) => {
    return canManageStatus || challenge.created_by === currentUserId;
  };

  useEffect(() => {
    if (showDesignThinkingPage) {
      navigate("/dashboard/projects/create-project");
    }
  }, [showDesignThinkingPage, navigate]);

  const handleCreateProject = (projectData: Partial<ProjectCardProps>) => {
    const newProject: ProjectCardProps = {
      id: (projects.length + 1).toString(),
      title: projectData.title || "",
      description: projectData.description || "",
      status: projectData.status || "in_progress",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      projectPhases: ["DT"]
    };
  
    setProjects([newProject, ...projects]);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateChallenge = async (title: string, description: string) => {
    const challenge = await createChallenge(title, description);
    if (challenge) {
      setShowCreateChallengeDialog(false);
    }
  };

  const handleStatusChange = (challengeId: string, newStatus: string) => {
    updateChallengeStatus(challengeId, newStatus as ChallengeStatus);
  };

  const handleDelete = (challengeId: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      deleteChallenge(challengeId);
    }
  };

  const getStatusColor = (status: ChallengeStatus) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <Routes>
      <Route
        path="/create-project"
        element={
          <div className="min-h-screen bg-gray-50">
            <ProjectNavBar onBackToProjects={() => setShowDesignThinkingPage(false)} />
          </div>
        }
      />
      <Route
        path="/"
        element={
          <>
            <SearchHeader />
            <div className="container max-w-7xl px-8 py-8 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <CreateProjectButton onClick={handleOpenCreateDialog} />
              </div>

              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="projects">My Projects</TabsTrigger>
                  <TabsTrigger value="ideas">Collect Ideas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects" className="space-y-6 mt-6">
                  <ProjectBanner onCreateProject={handleOpenCreateDialog} />

                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="mb-4">No projects created yet</p>
                      <CreateProjectButton onClick={handleOpenCreateDialog} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <div key={project.id}>
                          <ProjectCard {...project} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ideas" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Design Thinking Challenges</h2>
                      <p className="text-muted-foreground mt-2">
                        Collect and collaborate on design thinking challenges with your team
                      </p>
                    </div>
                    <Button onClick={() => setShowCreateChallengeDialog(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Challenge
                    </Button>
                  </div>

                  {challengesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <LoadingSpinner />
                    </div>
                  ) : challenges.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No challenges yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first design thinking challenge to start collecting ideas from your team
                        </p>
                        <Button onClick={() => setShowCreateChallengeDialog(true)} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Your First Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {challenges.map((challenge) => (
                        <Card 
                          key={challenge.id} 
                          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                          onClick={() => navigate(`/dashboard/projects/ideas/${challenge.id}`)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                              <CardTitle className="text-lg line-clamp-2">{challenge.title}</CardTitle>
                              <div className="flex gap-1">
                                <Badge className={getStatusColor(challenge.status as ChallengeStatus)}>
                                  {challenge.status.replace('_', ' ')}
                                </Badge>
                                {canDelete(challenge) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(challenge.id);
                                    }}
                                    className="text-destructive hover:text-destructive p-1 h-auto"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            {challenge.description && (
                              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                {challenge.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={challenge.creator?.avatar_url || ''} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(
                                    challenge.creator?.first_name,
                                    challenge.creator?.last_name,
                                    challenge.creator?.email || ''
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {challenge.creator?.first_name && challenge.creator?.last_name
                                  ? `${challenge.creator.first_name} ${challenge.creator.last_name}`
                                  : challenge.creator?.email}
                              </span>
                            </div>
                          </CardContent>

                          <CardFooter className="flex justify-between items-center pt-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(challenge.created_at), 'MMM d, yyyy')}
                            </span>
                            {canManageStatus && (
                              <Select
                                value={challenge.status}
                                onValueChange={(value: ChallengeStatus) => {
                                  handleStatusChange(challenge.id, value);
                                }}
                              >
                                <SelectTrigger 
                                  className="w-auto h-auto p-1 text-xs border-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="on_hold">On Hold</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreateProject={handleCreateProject}
                onStartDesignThinking={() => {
                  setIsCreateDialogOpen(false);
                  setShowDesignThinkingPage(true);
                }} 
              />

              <CreateChallengeDialog
                open={showCreateChallengeDialog}
                onOpenChange={setShowCreateChallengeDialog}
                onSubmit={handleCreateChallenge}
              />
            </div>
          </>
        }
      />
    </Routes>
  );
}
