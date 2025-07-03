
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateChallengeDialog } from '@/components/challenges/CreateChallengeDialog';
import { useDesignChallenges } from '@/hooks/useDesignChallenges';
import { useWorkspaceRole } from '@/hooks/useWorkspaceRole';
import { WorkspaceContext } from '@/components/layout/DashboardLayout';
import { ChallengeStatus } from '@/types/designChallenge';

const statusColors = {
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  in_progress: 'In Progress',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
};

export default function DesignChallenges() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { challenges, loading, updateChallengeStatus, deleteChallenge } = useDesignChallenges();
  const { currentWorkspace } = useContext(WorkspaceContext);
  const { isAdmin, isOwner } = useWorkspaceRole(currentWorkspace?.id);
  const navigate = useNavigate();

  const canManageStatus = isAdmin || isOwner;

  const handleStatusChange = (challengeId: string, newStatus: ChallengeStatus) => {
    updateChallengeStatus(challengeId, newStatus);
  };

  const handleDelete = (challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      deleteChallenge(challengeId);
    }
  };

  const getCreatorName = (challenge: any) => {
    if (challenge.profiles) {
      const { first_name, last_name } = challenge.profiles;
      return [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
    }
    return 'Anonymous';
  };

  const getCreatorInitials = (challenge: any) => {
    if (challenge.profiles) {
      const { first_name, last_name } = challenge.profiles;
      const initials = [first_name, last_name]
        .filter(Boolean)
        .map(name => name.charAt(0).toUpperCase())
        .join('');
      return initials || 'A';
    }
    return 'A';
  };

  if (loading) {
    return (
      <div className="container max-w-7xl px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Design Challenges</h1>
          <p className="text-muted-foreground mt-1">
            Collaborate on design thinking challenges with your team
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No challenges yet</h3>
          <p className="text-muted-foreground mb-4">
            Start collaborating by creating your first design challenge
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Challenge
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboard/challenges/${challenge.id}`)}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{challenge.title}</CardTitle>
                  <Badge
                    className={`mt-2 ${statusColors[challenge.status as keyof typeof statusColors]}`}
                    variant="secondary"
                  >
                    {statusLabels[challenge.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canManageStatus && (
                      <>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(challenge.id, 'in_progress');
                          }}
                        >
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(challenge.id, 'completed');
                          }}
                        >
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(challenge.id, 'on_hold');
                          }}
                        >
                          Put On Hold
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(challenge.id, 'cancelled');
                          }}
                        >
                          Cancel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(challenge.id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {challenge.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {challenge.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={challenge.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getCreatorInitials(challenge)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getCreatorName(challenge)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(challenge.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateChallengeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
