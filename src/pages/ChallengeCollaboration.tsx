import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Plus } from 'lucide-react';
import { StickyNoteComponent } from '@/components/challenges/StickyNoteComponent';
import { CreateStickyNoteDialog } from '@/components/challenges/CreateStickyNoteDialog';
import { useStickyNotes } from '@/hooks/useStickyNotes';
import { supabase } from '@/integrations/supabase/client';
import { DesignChallenge } from '@/types/designChallenge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWorkspaceRole } from '@/hooks/useWorkspaceRole';
import { format } from 'date-fns';

const ChallengeCollaboration = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<DesignChallenge | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: roleData } = useWorkspaceRole();
  const { currentUserId, userRole } = roleData || {};
  const { stickyNotes, createStickyNote, updateStickyNotePosition, deleteStickyNote } = useStickyNotes(challengeId || null);

  const canDeleteAny = userRole === 'admin' || userRole === 'owner';

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;

      try {
        const { data, error } = await supabase
          .from('design_challenges')
          .select(`
            *,
            creator:profiles!design_challenges_created_by_fkey(
              id,
              first_name,
              last_name,
              avatar_url,
              email
            )
          `)
          .eq('id', challengeId)
          .single();

        if (error) throw error;
        setChallenge(data);
      } catch (error) {
        console.error('Error fetching challenge:', error);
        navigate('/dashboard/challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, navigate]);

  const handleCreateStickyNote = async (content: string) => {
    const newNote = await createStickyNote(content);
    if (newNote) {
      setShowCreateDialog(false);
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

  if (!challenge) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Challenge Not Found</h1>
          <Button onClick={() => navigate('/dashboard/challenges')}>
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/challenges')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Button>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{challenge.title}</h1>
              {challenge.description && (
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  <span>
                    Created by {challenge.creator?.first_name && challenge.creator?.last_name
                      ? `${challenge.creator.first_name} ${challenge.creator.last_name}`
                      : challenge.creator?.email}
                  </span>
                </div>
                <span>•</span>
                <span>{format(new Date(challenge.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Idea
            </Button>
          </div>
        </div>
      </div>

      {/* Collaboration Area */}
      <div className="relative w-full h-[calc(100vh-200px)] overflow-auto bg-gray-50">
        <div className="absolute inset-0 min-w-[2000px] min-h-[1500px]">
          {stickyNotes.map((note) => (
            <StickyNoteComponent
              key={note.id}
              note={note}
              onPositionChange={(x, y) => updateStickyNotePosition(note.id, x, y)}
              onDelete={() => deleteStickyNote(note.id)}
              canDelete={canDeleteAny || note.created_by === currentUserId}
            />
          ))}
          
          {stickyNotes.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Card className="text-center p-8">
                <CardHeader>
                  <CardTitle>No ideas yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Start collaborating by adding your first idea!
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Idea
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <CreateStickyNoteDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateStickyNote}
      />
    </div>
  );
};

export default ChallengeCollaboration;