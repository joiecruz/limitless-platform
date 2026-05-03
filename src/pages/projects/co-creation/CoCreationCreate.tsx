import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";

interface DraftQuestion {
  text: string;
  framing: string;
  examples: string;
  phase: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);

export default function CoCreationCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventMode, setEventMode] = useState(false);
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { text: "", framing: "", examples: "", phase: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    if (questions.length >= 5) return;
    setQuestions([...questions, { text: "", framing: "", examples: "", phase: "" }]);
  };

  const removeQuestion = (i: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const update = (i: number, field: keyof DraftQuestion, val: string) => {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, [field]: val } : q)));
  };

  const handleSubmit = async () => {
    if (!currentWorkspace?.id) {
      toast({ title: "No workspace selected", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const validQs = questions.filter((q) => q.text.trim());
    if (validQs.length < 1) {
      toast({ title: "Add at least one guide question", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: session, error } = await supabase
        .from("cocreation_sessions")
        .insert({
          workspace_id: currentWorkspace.id,
          owner_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          slug: slugify(title),
          event_mode: eventMode,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      const qRows = validQs.map((q, idx) => ({
        session_id: session.id,
        position: idx,
        text: q.text.trim(),
        framing: q.framing.trim() || null,
        examples: q.examples
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        phase: q.phase.trim() || null,
      }));
      const { error: qErr } = await supabase.from("cocreation_questions").insert(qRows);
      if (qErr) throw qErr;

      toast({ title: "Session created" });
      navigate(`/dashboard/projects/co-creation/${session.id}`);
    } catch (e: any) {
      toast({ title: "Failed to create session", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl px-4 sm:px-8 py-8 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/dashboard/projects")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Button>

      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold">New AI-Assisted Co-Creation</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Future of public service in 2030"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              placeholder="What's this session about? Who's it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="event-mode">Event Mode</Label>
              <p className="text-xs text-muted-foreground">
                Activate one question at a time, lock phases as you go.
              </p>
            </div>
            <Switch id="event-mode" checked={eventMode} onCheckedChange={setEventMode} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Guide questions ({questions.length}/5)</CardTitle>
            <Button size="sm" variant="outline" onClick={addQuestion} disabled={questions.length >= 5}>
              <Plus className="h-4 w-4 mr-1" /> Add question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Question {i + 1}</span>
                {questions.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  placeholder="What problem should we focus on?"
                  value={q.text}
                  onChange={(e) => update(i, "text", e.target.value)}
                  maxLength={300}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Answer framing (optional)</Label>
                  <Input
                    placeholder="e.g. WHO + WHAT + HOW"
                    value={q.framing}
                    onChange={(e) => update(i, "framing", e.target.value)}
                    maxLength={150}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phase label (optional)</Label>
                  <Input
                    placeholder="e.g. Problems"
                    value={q.phase}
                    onChange={(e) => update(i, "phase", e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Example answers (optional, one per line)</Label>
                <Textarea
                  placeholder={"e.g. Limited access to digital services in rural areas\nLow digital literacy among older citizens"}
                  value={q.examples}
                  onChange={(e) => update(i, "examples", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/dashboard/projects")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating..." : "Create session"}
        </Button>
      </div>
    </div>
  );
}
