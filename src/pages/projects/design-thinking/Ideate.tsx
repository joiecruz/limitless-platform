import { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { useIdeate, IDEATE_STAGE_ID } from '@/hooks/useIdeate';
import { WandSparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StickyNoteCard, { StickyNote } from '@/components/projects/StickyNoteCard';
import CreateNoteDialog from '@/components/projects/CreateNoteDialog';

export default function Ideate() {
  usePageTitle('Project Ideate | Limitless Lab');
  const TEST_PROJECT_ID = '19fb5cb9-0290-48a0-b7e0-ee7c9e98166e';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<{ title: string; description: string } | null>(null);
  const [projectData, setProjectData] = useState<{
    name: string;
    description?: string;
    problem?: string;
    customers?: string;
    targetOutcomes?: string;
  } | null>(null);
  const { toast } = useToast();
  const {
    data: ideateData,
    isLoading: ideateLoading,
    loadIdeate,
    generateIdeas,
    getNotes,
    addNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    moveNote,
  } = useIdeate(TEST_PROJECT_ID);
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);

  // --- Local notes state for instant UI updates ---
  const [localNotes, setLocalNotes] = useState<StickyNote[]>([]);

  // On load, sync localNotes from DB
  useEffect(() => {
    loadIdeate().then(() => {
      setLocalNotes(getNotes());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TEST_PROJECT_ID]);

  // When ideateData changes (e.g., after add/edit/delete), sync localNotes
  useEffect(() => {
    setLocalNotes(getNotes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideateData]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', TEST_PROJECT_ID)
          .single();
        if (error) throw error;
        const metadata = (project.metadata as any) || {};
        setProjectData({
          name: project.name || '',
          description: project.description || '',
          problem: metadata.problem || '',
          customers: metadata.customers || '',
          targetOutcomes: metadata.targetOutcomes || '',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch project data for idea generation.',
          variant: 'destructive',
        });
      }
    };
    fetchProjectData();
  }, [toast]);

  // Generate ideas handler using Edge Function
  const handleGenerateIdeas = async () => {
    if (!projectData?.name) {
      toast({
        title: 'Project name required',
        description: 'Please ensure your project has a name before generating ideas.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const ideas = await generateIdeas({
        projectName: projectData.name,
        projectDescription: projectData.description,
        projectProblem: projectData.problem,
        projectCustomers: projectData.customers,
        targetOutcomes: projectData.targetOutcomes,
      });
      if (Array.isArray(ideas) && ideas.length > 0) {
        setGeneratedIdea({
          title: ideas[0].title || 'Untitled',
          description: ideas[0].description || '',
        });
        setGenerateDialogOpen(true);
      }
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Local note handlers for instant UI ---
  const handleAddNote = (noteData: Partial<StickyNote>) => {
    const notesCount = localNotes.length;
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      title: noteData.title || 'Untitled',
      description: noteData.description || '',
      position: { x: 100 + notesCount * 30, y: 100 + notesCount * 30 },
      color: noteData.color || '#FEF3C7',
      is_favorite: false,
      created_by: '', // always pass as string
    };
    setLocalNotes(prev => [...prev, newNote]);
    addNote({ ...newNote, created_by: newNote.created_by || '' }); // sync to DB in background
    setDialogOpen(false);
  };
  const handleEditNote = (noteData: Partial<StickyNote>) => {
    if (!editingNote) return;
    const updatedNote = { ...editingNote, ...noteData };
    setLocalNotes(prev => prev.map(n => n.id === editingNote.id ? updatedNote : n));
    updateNote(editingNote.id, noteData); // sync to DB in background
    setEditingNote(null);
  };
  const handleDeleteNote = (id: string) => {
    setLocalNotes(prev => prev.filter(n => n.id !== id));
    deleteNote(id); // sync to DB in background
    toast({
      title: 'Idea Deleted!',
      description: 'Your idea has been deleted.',
    });
  };
  const handleFavoriteNote = (id: string) => {
    setLocalNotes(prev => prev.map(n => n.id === id ? { ...n, is_favorite: !n.is_favorite } : n));
    toggleFavorite(id); // sync to DB in background
  };
  const handleMoveNote = (id: string, position: { x: number; y: number }) => {
    setLocalNotes(prev => prev.map(n => n.id === id ? { ...n, position } : n));
    moveNote(id, position.x, position.y); // sync to DB in background
  };
  const handleGenerateSave = (noteData: Partial<StickyNote>) => {
    const notesCount = localNotes.length;
    const newNote: StickyNote = {
      id: crypto.randomUUID(),
      title: noteData.title || 'Untitled',
      description: noteData.description || '',
      position: { x: 100 + notesCount * 30, y: 100 + notesCount * 30 },
      color: noteData.color || '#FEF3C7',
      is_favorite: false,
      created_by: '', // always pass as string
    };
    setLocalNotes(prev => [...prev, newNote]);
    addNote({ ...newNote, created_by: newNote.created_by || '' }); // sync to DB in background
    setGenerateDialogOpen(false);
    setGeneratedIdea(null);
  };

  // Sort: favorites first, then by title (or creation order if available)
  const sortedNotes = [...localNotes].sort((a, b) => {
    if (a.is_favorite === b.is_favorite) return 0;
    return a.is_favorite ? -1 : 1;
  });

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="container max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Instructions box with title, subtitle, then banner image, then question */}
        <div className="w-full rounded-xl overflow-hidden shadow bg-white mb-6">
          <div className="p-8 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Collect Ideas</h1>
              <p className="text-gray-600 mb-4">
                {ideateData.instructions || 'Generate a wide range of ideas that could solve your chosen design challenge'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                className="bg-[#393CA0] hover:bg-[#393CA0]/90 text-white shadow-sm flex items-center"
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
              >
                <WandSparkles className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
              <Button
                variant="outline"
                className="border border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0]/10 px-4 rounded font-medium shadow-sm flex items-center"
                onClick={() => setDialogOpen(true)}
                disabled={dialogOpen}
              >
                + Add idea
              </Button>
            </div>
          </div>
          <img
            src="/images/innovation.png"
            alt="Innovation Banner"
            className="object-cover mx-8 rounded-xl shadow"
            style={{height: '100%', width: 'auto', maxWidth: 'calc(100% - 4rem)', objectPosition: 'center'}}
          />
          <div className="p-8 pt-6">
            <div className="bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{ideateData.question || 'How might we build a culture of innovation inside our company?'}</h2>
                <span className="ml-4 bg-indigo-100 text-[#393CA0] text-sm font-normal px-4 py-1 rounded-full shadow-sm" style={{minWidth: 60, textAlign: 'center'}}>
                  {localNotes.length} Idea{localNotes.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-gray-500">
                This question challenges us to think about how we can foster an environment where creativity, experimentation, and continuous improvement are ingrained in our company's DNA. Building a culture of innovation involves more than just implementing new processes or technologies; it requires cultivating an open mindset where employees at all levels feel empowered to share ideas, take risks, and collaborate across teams.
              </p>
            </div>
          </div>
        </div>
        {/* Sticky notes board - clean, containerless */}
        <div className="relative min-h-[600px] w-full" style={{ minHeight: 600 }}>
          {localNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <WandSparkles className="mx-auto h-12 w-12" />
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">No ideas yet</h4>
              <p className="text-gray-500">Start by generating AI ideas or adding your own ideas to the board using the buttons above.</p>
            </div>
          ) : (
            sortedNotes.map((note) => (
              <StickyNoteCard
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
                onFavorite={handleFavoriteNote}
                onMove={handleMoveNote}
              />
            ))
          )}
        </div>
      </div>
      {/* Dialogs moved outside container to fix z-index issues */}
      <CreateNoteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddNote}
      />
      <CreateNoteDialog
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleEditNote}
        initialNote={editingNote || undefined}
      />
      <CreateNoteDialog
        open={generateDialogOpen}
        onClose={() => {
          setGenerateDialogOpen(false);
          setGeneratedIdea(null);
        }}
        onSave={handleGenerateSave}
        initialNote={generatedIdea || undefined}
        title="Generate idea using AI"
        namePlaceholder="Suggestion board"
        descriptionPlaceholder="Set up suggestion board so that team members can freely voice out their ideas"
        createLabel="Create"
      />
    </div>
  );
} 