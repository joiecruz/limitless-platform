import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Globe, Sparkles, Lock, Unlock, Play, Image as ImageIcon, Presentation, Mic, Loader2, Download, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { QRCodeCanvas } from "qrcode.react";
import { getPublicSiteOrigin } from "@/utils/domainHelpers";

interface VisualOutput {
  id: string;
  image_url: string;
  created_at: string;
}

function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

interface Session {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  event_mode: boolean;
  active_question_id: string | null;
  workspace_id: string;
  owner_id: string;
  last_synthesis_at: string | null;
}

interface Question {
  id: string;
  text: string;
  position: number;
  framing: string | null;
  phase: string | null;
  locked: boolean;
}

interface Response {
  id: string;
  question_id: string;
  original_text: string;
  refined_text: string | null;
  upvote_count: number;
  participant_id: string;
  created_at: string;
}

interface ThemeBlock {
  label: string;
  insight: string;
}

interface Synthesis {
  id: string;
  question_id: string | null;
  themes: ThemeBlock[];
}

export default function CoCreationDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [participantNames, setParticipantNames] = useState<Record<string, string>>({});
  const [synthesis, setSynthesis] = useState<Synthesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [synthLoading, setSynthLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);
  const [visuals, setVisuals] = useState<VisualOutput[]>([]);
  const [activeVisualId, setActiveVisualId] = useState<string | null>(null);

  const publicUrl = session ? `${getPublicSiteOrigin()}/cocreate/${session.slug}` : "";

  const refreshResponses = async (sessionId: string) => {
    const [{ data: rs }, { data: ps }] = await Promise.all([
      supabase
        .from("cocreation_responses")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false }),
      supabase
        .from("cocreation_participants")
        .select("id, display_name")
        .eq("session_id", sessionId),
    ]);
    setResponses((rs as Response[]) || []);
    setParticipantNames(
      Object.fromEntries(((ps as any[]) || []).map((p) => [p.id, p.display_name])),
    );
  };

  const refreshSession = async (sessionId: string) => {
    const { data: s } = await supabase.from("cocreation_sessions").select("*").eq("id", sessionId).single();
    if (s) setSession(s as Session);
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: s } = await supabase.from("cocreation_sessions").select("*").eq("id", id).single();
      const { data: qs } = await supabase
        .from("cocreation_questions")
        .select("*")
        .eq("session_id", id)
        .order("position");
      const { data: rs } = await supabase
        .from("cocreation_responses")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: false });
      const { data: ps } = await supabase
        .from("cocreation_participants")
        .select("id, display_name")
        .eq("session_id", id);
      const { data: syn } = await supabase
        .from("cocreation_synthesis")
        .select("*")
        .eq("session_id", id);
      const { data: outs } = await supabase
        .from("cocreation_outputs")
        .select("id, content, created_at")
        .eq("session_id", id)
        .eq("kind", "visual")
        .order("created_at", { ascending: false });
      const visualList: VisualOutput[] = ((outs as any[]) || [])
        .map((o) => ({
          id: o.id,
          image_url: (o.content as any)?.image_url as string,
          created_at: o.created_at,
        }))
        .filter((o) => !!o.image_url);
      setVisuals(visualList);
      setActiveVisualId((prev) => prev ?? visualList[0]?.id ?? null);

      setSession(s as Session);
      setQuestions((qs as Question[]) || []);
      setResponses((rs as Response[]) || []);
      setSynthesis(((syn as any[]) || []).map((x) => ({ ...x, themes: x.themes as ThemeBlock[] })));
      setParticipantNames(
        Object.fromEntries(((ps as any[]) || []).map((p) => [p.id, p.display_name])),
      );
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`cocreate-dash-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_responses", filter: `session_id=eq.${id}` }, () => refreshResponses(id))
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_sessions", filter: `id=eq.${id}` }, () => refreshSession(id))
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_questions", filter: `session_id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_outputs", filter: `session_id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_synthesis", filter: `session_id=eq.${id}` }, load)
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Realtime channel issue:", status);
        }
      });

    // Polling fallback — guarantees ideas appear within ~5s even if realtime is degraded.
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshResponses(id);
      }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(interval);
    };
  }, [id]);

  const updateSession = async (patch: Partial<Session>) => {
    if (!session) return;
    const { error } = await supabase.from("cocreation_sessions").update(patch).eq("id", session.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
  };

  const setStatus = (status: string) => updateSession({ status });

  const toggleQuestionLock = async (q: Question) => {
    await supabase.from("cocreation_questions").update({ locked: !q.locked }).eq("id", q.id);
  };

  const setActiveQuestion = (qid: string) => updateSession({ active_question_id: qid });

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({ title: "Link copied" });
  };

  const runSynthesis = async () => {
    if (!session) return;
    setSynthLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("cocreation-synthesize", {
        body: { session_id: session.id },
      });
      if (error) throw error;
      toast({ title: "Synthesis complete", description: `${data?.themes_created || 0} themes created` });
      // Refresh synthesis + session (for last_synthesis_at). Session stays live.
      const [{ data: syn }, { data: s }] = await Promise.all([
        supabase.from("cocreation_synthesis").select("*").eq("session_id", session.id),
        supabase.from("cocreation_sessions").select("*").eq("id", session.id).single(),
      ]);
      setSynthesis(((syn as any[]) || []).map((x) => ({ ...x, themes: x.themes as ThemeBlock[] })));
      if (s) setSession(s as Session);
    } catch (e: any) {
      toast({ title: "Synthesis failed", description: e.message, variant: "destructive" });
    } finally {
      setSynthLoading(false);
    }
  };

  const generateVisual = async () => {
    if (!session) return;
    setVisualLoading(true);
    setVisualError(null);
    toast({ title: "Creating your visual summary…", description: "This may take 20–40 seconds." });
    try {
      const { data, error } = await supabase.functions.invoke("cocreation-generate-output", {
        body: { session_id: session.id, kind: "visual" },
      });
      if (error) throw error;
      const errMsg = (data as any)?.error;
      if (errMsg) throw new Error(errMsg);
      const out = (data as any)?.output;
      if (out?.id && out?.image_url) {
        setVisuals((prev) => {
          if (prev.some((v) => v.id === out.id)) return prev;
          return [{ id: out.id, image_url: out.image_url, created_at: out.created_at }, ...prev];
        });
        setActiveVisualId(out.id);
      }
      toast({ title: "Visual summary ready" });
    } catch (e: any) {
      const msg = e?.message || "Image generation failed";
      setVisualError(msg);
      toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setVisualLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return <div className="p-8">Session not found.</div>;
  }

  const responsesByQ = (qid: string) =>
    responses.filter((r) => r.question_id === qid).sort((a, b) => b.upvote_count - a.upvote_count);

  return (
    <div className="container max-w-6xl px-4 sm:px-8 py-8 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/dashboard/projects")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="outline">Co-Creation</Badge>
            <Badge>{session.status}</Badge>
            {session.event_mode && <Badge variant="secondary">Event Mode</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{session.title}</h1>
          {session.description && <p className="text-muted-foreground mt-1">{session.description}</p>}
        </div>
        <div className="flex gap-2">
          {session.status === "draft" && (
            <Button onClick={() => setStatus("live")}>
              <Play className="h-4 w-4 mr-1" /> Publish & go live
            </Button>
          )}
          {session.status === "live" && (
            <Button variant="outline" onClick={() => setStatus("draft")}>
              Pause
            </Button>
          )}
          {(session.status === "completed" || session.status === "synthesizing") && (
            <>
              <Button onClick={() => setStatus("live")}>
                <Play className="h-4 w-4 mr-1" /> Reopen for participation
              </Button>
              <Button variant="outline" onClick={() => setStatus("draft")}>
                Move to draft
              </Button>
            </>
          )}
        </div>
      </div>

      {session.status !== "draft" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Public participation link
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white p-3 rounded-lg border">
              <QRCodeCanvas value={publicUrl} size={160} />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-2">
                <Input value={publicUrl} readOnly />
                <Button onClick={copyLink} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this link or QR code. Participants can join anonymously without signing up.
              </p>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Event Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Activate one question at a time
                  </p>
                </div>
                <Switch
                  checked={session.event_mode}
                  onCheckedChange={(v) => updateSession({ event_mode: v })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Live responses</h2>
        {session.status === "live" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live · auto-refreshing
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">{responses.length} total ideas</span>
      </div>
      <div className="space-y-4 mb-8">
        {questions.map((q) => {
          const list = responsesByQ(q.id);
          const isActive = session.active_question_id === q.id;
          return (
            <Card key={q.id} className={isActive ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {q.phase && <Badge variant="outline" className="mb-1">{q.phase}</Badge>}
                    <CardTitle className="text-base">
                      Q{q.position + 1}. {q.text}
                    </CardTitle>
                    {q.framing && (
                      <p className="text-xs text-muted-foreground mt-1">Framing: {q.framing}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{list.length} ideas</Badge>
                    {session.event_mode && (
                      <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setActiveQuestion(q.id)}
                      >
                        {isActive ? "Active" : "Set active"}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => toggleQuestionLock(q)}>
                      {q.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ideas yet.</p>
                ) : (
                  <div className="space-y-2">
                    {list.slice(0, 8).map((r) => (
                      <div key={r.id} className="border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {participantNames[r.participant_id] || "Anonymous"}
                          </span>
                          <Badge variant="outline">▲ {r.upvote_count}</Badge>
                        </div>
                        <p className="text-sm">{r.original_text}</p>
                      </div>
                    ))}
                    {list.length > 8 && (
                      <p className="text-xs text-muted-foreground">+ {list.length - 8} more</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Synthesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate themed insights (3–5 per question) from all submitted ideas.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={runSynthesis} disabled={synthLoading || responses.length === 0}>
              {synthLoading
                ? "Synthesizing..."
                : synthesis.length > 0
                  ? "Re-run synthesis"
                  : "Run synthesis"}
            </Button>
            {session.last_synthesis_at && (
              <span className="text-xs text-muted-foreground">
                Last synthesized {timeAgo(session.last_synthesis_at)}
              </span>
            )}
          </div>

          {synthesis.length > 0 && (
            <div className="mt-6 space-y-4">
              {synthesis.map((s) => {
                const q = questions.find((qq) => qq.id === s.question_id);
                return (
                  <div key={s.id} className="border rounded-lg p-4">
                    <p className="font-medium mb-2">{q?.text || "Overall"}</p>
                    <ul className="space-y-2">
                      {s.themes.map((t, i) => (
                        <li key={i}>
                          <p className="text-sm font-semibold">{t.label}</p>
                          <p className="text-sm text-muted-foreground">{t.insight}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate outputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(() => {
            const hasSynthesis = synthesis.some((s) => s.themes && s.themes.length > 0);
            const active = visuals.find((v) => v.id === activeVisualId) || visuals[0];
            return (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={generateVisual}
                    disabled={visualLoading || !hasSynthesis}
                    title={!hasSynthesis ? "Run synthesis first" : undefined}
                  >
                    {visualLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : visuals.length > 0 ? (
                      <RefreshCw className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    {visuals.length > 0 ? "Regenerate visual summary" : "Generate visual summary"}
                  </Button>
                  <Button variant="outline" disabled>
                    <Presentation className="h-4 w-4" />
                    Slides — Coming soon
                  </Button>
                  <Button variant="outline" disabled>
                    <Mic className="h-4 w-4" />
                    Podcast digest — Coming soon
                  </Button>
                </div>

                {!hasSynthesis && (
                  <p className="text-sm text-muted-foreground">
                    Run AI synthesis above first — the visual summary illustrates the synthesized themes.
                  </p>
                )}

                {visualError && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{visualError}</span>
                  </div>
                )}

                {visualLoading && !active && (
                  <div className="space-y-2">
                    <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                    <p className="text-xs text-muted-foreground">
                      Drawing your visual summary… this usually takes 20–40 seconds.
                    </p>
                  </div>
                )}

                {active && (
                  <div className="space-y-3">
                    <div className="border rounded-lg overflow-hidden bg-muted/20 relative">
                      <img
                        src={active.image_url}
                        alt="Visual summary"
                        className="w-full h-auto block"
                      />
                      {visualLoading && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t bg-background">
                        <p className="text-xs text-muted-foreground">
                          Generated {timeAgo(active.created_at)}
                        </p>
                        <div className="flex items-center gap-2">
                          <a
                            href={active.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" /> Open
                          </a>
                          <a
                            href={active.image_url}
                            download
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                          >
                            <Download className="h-4 w-4" /> Download
                          </a>
                        </div>
                      </div>
                    </div>

                    {visuals.length > 1 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                          History ({visuals.length})
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {visuals.map((v) => {
                            const isActive = v.id === active.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => setActiveVisualId(v.id)}
                                title={`Generated ${timeAgo(v.created_at)}`}
                                className={`relative shrink-0 w-28 h-20 rounded-md overflow-hidden border-2 transition ${
                                  isActive
                                    ? "border-primary ring-2 ring-primary/30"
                                    : "border-border hover:border-primary/60"
                                }`}
                              >
                                <img
                                  src={v.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!active && !visualLoading && hasSynthesis && (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No visual summary yet</p>
                    <p className="text-xs text-muted-foreground">
                      Generate a hand-drawn poster of your synthesized themes.
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
