
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { DesignChallenge } from '@/types/designChallenge';
import { useStickyNotes } from '@/hooks/useStickyNotes';
import { StickyNoteComponent } from '@/components/challenges/StickyNoteComponent';
import { CreateStickyNoteDialog } from '@/components/challenges/CreateStickyNoteDialog';
import { useWorkspaceRole } from '@/hooks/useWorkspaceRole';
import { useToast } from '@/hooks/use-toast';

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

export default function ChallengeCollaboration() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<DesignChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { stickyNotes, createStickyNote, updateStickyNotePosition, deleteStickyNote } = useStickyNotes(id || null);
  const { isAdmin, isOwner } = useWorkspaceRole(challenge?.workspace_id);

  const canDelete = isAdmin || isOwner;

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      try {
        const { data, error } = await supabase
          .from('design_challenges')
          .select(`
            *,
            profiles (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setChallenge(data);
      } catch (error: any) {
        toast({
          title: 'Error loading challenge',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/dashboard/challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id, navigate, toast]);

  const handleBoardDoubleClick = (e: React.MouseEvent) => {
    if (!boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickPosition({ x, y });
    setIsCreateDialogOpen(true);
  };

  const handleCreateStickyNote = async (content: string, color: string) => {
    await createStickyNote(content, clickPosition.x, clickPosition.y, color);
  };

  const getCreatorName = (item: any) => {
    if (item.profiles) {
      const { first_name, last_name } = item.profiles;
      return [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
    }
    return 'Anonymous';
  };

  const getCreatorInitials = (item: any) => {
    if (item.profiles) {
      const { first_name, last_name } = item.profiles;
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Challenge not found</h2>
          <Button onClick={() => navigate('/dashboard/challenges')}>
            Go back to challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/challenges')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Challenges
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{challenge.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <Badge
                  className={statusColors[challenge.status as keyof typeof statusColors]}
                  variant="secondary"
                >
                  {statusLabels[challenge.status as keyof typeof statusLabels]}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={challenge.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getCreatorInitials(challenge)}
                    </AvatarFallback>
                  </Avatar>
                  <span>Created by {getCreatorName(challenge)}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Idea
          </Button>
        </div>
        {challenge.description && (
          <p className="text-muted-foreground mt-4 max-w-3xl">{challenge.description}</p>
        )}
      </div>

      {/* Collaboration Board */}
      <div
        ref={boardRef}
        className="relative w-full h-[calc(100vh-200px)] overflow-auto bg-gray-100"
        onDoubleClick={handleBoardDoubleClick}
      >
        <div className="absolute inset-0 p-8">
          <div className="text-center text-muted-foreground mb-8">
            <p>Double-click anywhere to add a new idea</p>
          </div>
          
          {stickyNotes.map((note) => (
            <StickyNoteComponent
              key={note.id}
              note={note}
              onPositionChange={updateStickyNotePosition}
              onDelete={deleteStickyNote}
              canDelete={canDelete}
              creatorName={getCreatorName(note)}
              creatorInitials={getCreatorInitials(note)}
            />
          ))}
        </div>
      </div>

      <CreateStickyNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateNote={handleCreateStickyNote}
      />
    </div>
  );
}
