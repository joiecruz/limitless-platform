import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { useDesignChallenges } from '@/hooks/useDesignChallenges';
import { useCurrentWorkspace } from '@/hooks/useCurrentWorkspace';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Plus, Trash2 } from 'lucide-react';
import { DesignChallenge, ChallengeStatus } from '@/types/designChallenge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const DesignChallenges = () => {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: workspace } = useCurrentWorkspace();
  const { workspaceId, userRole, currentUserId } = workspace || {};
  const { challenges, loading, createChallenge, updateChallengeStatus, deleteChallenge } = useDesignChallenges(workspaceId);

  const canManageStatus = userRole === 'admin' || userRole === 'owner';
  
  const canDelete = (challenge: DesignChallenge) => {
    return canManageStatus || challenge.created_by === currentUserId;
  };

  const handleCreateChallenge = async (title: string, description: string) => {
    const challenge = await createChallenge(title, description);
    if (challenge) {
      setShowCreateDialog(false);
    }
  };

  const handleStatusChange = (challengeId: string, newStatus: string) => {
    updateChallengeStatus(challengeId, newStatus as any);
    updateChallengeStatus(challengeId, newStatus as any);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Design Challenges</h1>
          <p className="text-muted-foreground mt-2">
            Collect and collaborate on design thinking challenges
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      {challenges.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-foreground mb-2">No challenges yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first design challenge to start collecting ideas
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
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
              onClick={() => navigate(`/dashboard/challenges/${challenge.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-2">{challenge.title}</CardTitle>
                  <div className="flex gap-1">
                    <Badge className={getStatusColor(challenge.status)}>
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

      <CreateChallengeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateChallenge}
      />
    </div>
  );
};

export default DesignChallenges;