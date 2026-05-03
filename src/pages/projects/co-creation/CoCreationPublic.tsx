import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { getOrCreateAnonIdentity } from "@/lib/anonymousName";
import { Sparkles, Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  event_mode: boolean;
  active_question_id: string | null;
}

interface Question {
  id: string;
  text: string;
  position: number;
  framing: string | null;
  phase: string | null;
  locked: boolean;
  examples: string[];
}

interface Response {
  id: string;
  question_id: string;
  original_text: string;
  refined_text: string | null;
  upvote_count: number;
  participant_id: string;
}

const NOTE_STYLES = [
  "bg-yellow-100 border-yellow-200 -rotate-1",
  "bg-pink-100 border-pink-200 rotate-1",
  "bg-blue-100 border-blue-200 -rotate-1",
  "bg-green-100 border-green-200 rotate-1",
  "bg-purple-100 border-purple-200 -rotate-1",
  "bg-orange-100 border-orange-200 rotate-1",
];

function noteStyleFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NOTE_STYLES[h % NOTE_STYLES.length];
}

export default function CoCreationPublic() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [myUpvotes, setMyUpvotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const init = async () => {
      const { data: s, error } = await supabase
        .from("cocreation_sessions")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !s) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setSession(s as Session);
      const { token, displayName: name } = getOrCreateAnonIdentity(slug);
      setDisplayName(name);

      const { data: existing } = await supabase
        .from("cocreation_participants")
        .select("id")
        .eq("session_id", s.id)
        .eq("anon_token", token)
        .maybeSingle();
      let pid = existing?.id;
      if (!pid) {
        const { data: created } = await supabase
          .from("cocreation_participants")
          .insert({ session_id: s.id, anon_token: token, display_name: name })
          .select("id")
          .single();
        pid = created?.id;
      }
      setParticipantId(pid || null);

      const { data: qs } = await supabase
        .from("cocreation_questions")
        .select("*")
        .eq("session_id", s.id)
        .order("position");
      setQuestions((qs as any) || []);

      const { data: rs } = await supabase
        .from("cocreation_responses")
        .select("*")
        .eq("session_id", s.id)
        .order("created_at", { ascending: false });
      setResponses((rs as Response[]) || []);

      if (pid) {
        const { data: votes } = await supabase
          .from("cocreation_upvotes")
          .select("response_id")
          .eq("participant_id", pid);
        setMyUpvotes(new Set(((votes as any[]) || []).map((v) => v.response_id)));
      }
      setLoading(false);
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Realtime
  useEffect(() => {
    if (!session) return;
    const ch = supabase
      .channel(`cocreate-pub-${session.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cocreation_responses", filter: `session_id=eq.${session.id}` },
        async () => {
          const { data: rs } = await supabase
            .from("cocreation_responses")
            .select("*")
            .eq("session_id", session.id)
            .order("created_at", { ascending: false });
          setResponses((rs as Response[]) || []);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "cocreation_sessions", filter: `id=eq.${session.id}` },
        (payload) => setSession(payload.new as Session),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cocreation_questions", filter: `session_id=eq.${session.id}` },
        async () => {
          const { data: qs } = await supabase
            .from("cocreation_questions")
            .select("*")
            .eq("session_id", session.id)
            .order("position");
          setQuestions((qs as any) || []);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session?.id]);

  // In event mode, follow the host's active question
  useEffect(() => {
    if (!session?.event_mode || !session.active_question_id) return;
    const idx = questions.findIndex((q) => q.id === session.active_question_id);
    if (idx >= 0) setCurrentIndex(idx);
  }, [session?.event_mode, session?.active_question_id, questions]);

  const currentQuestion = questions[currentIndex];

  const currentResponses = useMemo(() => {
    if (!currentQuestion) return [];
    return responses
      .filter((r) => r.question_id === currentQuestion.id)
      .sort((a, b) => b.upvote_count - a.upvote_count);
  }, [responses, currentQuestion]);

  const isActive = currentQuestion
    ? session?.event_mode
      ? session.active_question_id === currentQuestion.id
      : !currentQuestion.locked
    : false;
  const canSubmit =
    session?.status === "live" && currentQuestion && !currentQuestion.locked && (!session.event_mode || isActive);

  const submitResponse = async () => {
    if (!session || !participantId || !currentQuestion) return;
    const text = draft.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      let refined: string | null = null;
      try {
        const { data } = await supabase.functions.invoke("cocreation-refine-response", {
          body: { text, question: currentQuestion.text, framing: currentQuestion.framing },
        });
        refined = data?.refined || null;
      } catch {
        // optional
      }
      const { error } = await supabase.from("cocreation_responses").insert({
        session_id: session.id,
        question_id: currentQuestion.id,
        participant_id: participantId,
        original_text: text,
        refined_text: refined,
      });
      if (error) throw error;
      setDraft("");
      setDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Couldn't submit", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUpvote = async (r: Response) => {
    if (!participantId || session?.status !== "live") return;
    if (myUpvotes.has(r.id)) {
      await supabase
        .from("cocreation_upvotes")
        .delete()
        .eq("response_id", r.id)
        .eq("participant_id", participantId);
      setMyUpvotes((s) => {
        const n = new Set(s);
        n.delete(r.id);
        return n;
      });
    } else {
      const { error } = await supabase
        .from("cocreation_upvotes")
        .insert({ response_id: r.id, participant_id: participantId });
      if (!error) setMyUpvotes((s) => new Set(s).add(r.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Session not found</h1>
          <p className="text-muted-foreground">This session doesn't exist or isn't public yet.</p>
        </div>
      </div>
    );
  }

  if (session.status !== "live" && session.status !== "synthesizing" && session.status !== "completed") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Not yet live</h1>
          <p className="text-muted-foreground">The host hasn't published this session yet.</p>
        </div>
      </div>
    );
  }

  const isCompleted = session.status === "completed";
  const total = questions.length;
  const progressValue = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const canPrev = !session.event_mode && currentIndex > 0;
  const canNext = !session.event_mode && currentIndex < total - 1;

  return (
    <div className="min-h-screen bg-muted/20 pb-32">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/limitless-logo.svg"
              alt="Limitless Lab"
              className="h-7 w-auto shrink-0"
            />
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="h-5 w-px bg-border" />
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">
                AI-Assisted Co-Creation
              </span>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">You: {displayName}</Badge>
        </div>
      </header>

      <main className="container max-w-4xl px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{session.title}</h1>
        {session.description && (
          <p className="text-muted-foreground mb-6">{session.description}</p>
        )}

        {isCompleted && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-sm">
            This session is closed. You can still browse responses below.
          </div>
        )}

        {total > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>
                Question {currentIndex + 1} of {total}
                {currentQuestion?.phase ? ` · ${currentQuestion.phase}` : ""}
              </span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}

        {currentQuestion && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              {currentQuestion.text}
            </h2>
            {currentQuestion.framing && (
              <p className="text-sm text-muted-foreground">{currentQuestion.framing}</p>
            )}
            {currentQuestion.examples?.length > 0 && (
              <div className="text-xs text-muted-foreground mt-3">
                <p className="font-medium mb-1">Examples:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {currentQuestion.examples.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            {!canSubmit && session.status === "live" && (
              <p className="text-xs text-muted-foreground italic mt-3">
                {currentQuestion.locked
                  ? "Locked by host."
                  : "Waiting for host to activate this question."}
              </p>
            )}
          </div>
        )}

        {/* Sticky-note board */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {currentResponses.length === 0 ? (
            <div className="col-span-full border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
              Be the first to share an idea.
            </div>
          ) : (
            currentResponses.map((r) => {
              const upvoted = myUpvotes.has(r.id);
              return (
                <div
                  key={r.id}
                  className={`relative rounded-lg border p-4 shadow-md transition hover:rotate-0 hover:scale-[1.02] ${noteStyleFor(
                    r.id,
                  )}`}
                >
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {r.refined_text || r.original_text}
                  </p>
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      onClick={() => toggleUpvote(r)}
                      disabled={session.status !== "live"}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition ${
                        upvoted
                          ? "bg-red-500 text-white"
                          : "bg-white/70 text-gray-700 hover:bg-white"
                      } ${session.status !== "live" ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${upvoted ? "fill-current" : ""}`} />
                      <span>{r.upvote_count}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Prev/Next nav (free mode) */}
        {!session.event_mode && total > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>

      {/* Floating add button */}
      {canSubmit && (
        <button
          onClick={() => setDialogOpen(true)}
          aria-label="Add idea"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition z-20"
        >
          <Plus className="h-7 w-7" />
        </button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share an idea</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <p className="text-sm text-muted-foreground -mt-2">
              {currentQuestion.text}
            </p>
          )}
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your idea..."
            rows={5}
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right">
            {draft.length}/500
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitResponse} disabled={!draft.trim() || submitting}>
              {submitting ? "Posting..." : "Post idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
