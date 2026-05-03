import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { getOrCreateAnonIdentity } from "@/lib/anonymousName";
import { Sparkles, ChevronUp } from "lucide-react";

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

export default function CoCreationPublic() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [myUpvotes, setMyUpvotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

      // upsert participant
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

  // Realtime subscription
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
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session?.id]);

  const submitResponse = async (q: Question) => {
    if (!session || !participantId) return;
    const text = (drafts[q.id] || "").trim();
    if (!text) return;
    setSubmitting((s) => ({ ...s, [q.id]: true }));
    try {
      let refined: string | null = null;
      try {
        const { data } = await supabase.functions.invoke("cocreation-refine-response", {
          body: { text, question: q.text, framing: q.framing },
        });
        refined = data?.refined || null;
      } catch {
        // refinement is optional
      }
      const { error } = await supabase.from("cocreation_responses").insert({
        session_id: session.id,
        question_id: q.id,
        participant_id: participantId,
        original_text: text,
        refined_text: refined,
      });
      if (error) throw error;
      setDrafts((d) => ({ ...d, [q.id]: "" }));
    } catch (e: any) {
      toast({ title: "Couldn't submit", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting((s) => ({ ...s, [q.id]: false }));
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
      if (!error) {
        setMyUpvotes((s) => new Set(s).add(r.id));
      }
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
          <p className="text-muted-foreground">This co-creation session doesn't exist or isn't public yet.</p>
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

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b">
        <div className="container max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Co-Creation</span>
          </div>
          <Badge variant="outline">You: {displayName}</Badge>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{session.title}</h1>
        {session.description && <p className="text-muted-foreground mb-6">{session.description}</p>}

        {isCompleted && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-sm">
            This session is closed. You can still browse responses below.
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q) => {
            const list = responses
              .filter((r) => r.question_id === q.id)
              .sort((a, b) => b.upvote_count - a.upvote_count);
            const isActive = session.event_mode ? session.active_question_id === q.id : !q.locked;
            const canSubmit = session.status === "live" && !q.locked && (!session.event_mode || isActive);
            return (
              <Card key={q.id} className={session.event_mode && isActive ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  {q.phase && <Badge variant="outline" className="w-fit mb-1">{q.phase}</Badge>}
                  <CardTitle className="text-lg">
                    Q{q.position + 1}. {q.text}
                  </CardTitle>
                  {q.framing && (
                    <p className="text-xs text-muted-foreground">Framing: {q.framing}</p>
                  )}
                  {q.examples?.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      <p className="font-medium mb-1">Examples:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {q.examples.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {canSubmit && (
                    <div className="space-y-2">
                      <Textarea
                        value={drafts[q.id] || ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                        placeholder="Share your idea..."
                        rows={2}
                        maxLength={500}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => submitResponse(q)}
                          disabled={!drafts[q.id]?.trim() || submitting[q.id]}
                        >
                          {submitting[q.id] ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  )}
                  {!canSubmit && session.event_mode && session.status === "live" && (
                    <p className="text-xs text-muted-foreground italic">
                      {q.locked ? "Locked by host." : "Waiting for host to activate this question."}
                    </p>
                  )}

                  <div className="space-y-2">
                    {list.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Be the first to share an idea.</p>
                    ) : (
                      list.map((r) => {
                        const upvoted = myUpvotes.has(r.id);
                        return (
                          <div key={r.id} className="border rounded-lg p-3 bg-background flex gap-3">
                            <button
                              onClick={() => toggleUpvote(r)}
                              disabled={session.status !== "live"}
                              className={`flex flex-col items-center justify-center min-w-[44px] rounded-md border px-2 py-1 text-xs transition ${
                                upvoted ? "bg-primary text-primary-foreground border-primary" : "bg-muted hover:bg-muted/70"
                              } ${session.status !== "live" ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              <ChevronUp className="h-4 w-4" />
                              <span>{r.upvote_count}</span>
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{r.refined_text || r.original_text}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
