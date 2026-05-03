import { useEffect, useState } from "react";
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
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_responses", filter: `session_id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_sessions", filter: `id=eq.${id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "cocreation_questions", filter: `session_id=eq.${id}` }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      await supabase.from("cocreation_sessions").update({ status: "synthesizing" }).eq("id", session.id);
      const { data, error } = await supabase.functions.invoke("cocreation-synthesize", {
        body: { session_id: session.id },
      });
      if (error) throw error;
      toast({ title: "Synthesis complete", description: `${data?.themes_created || 0} themes created` });
      await supabase.from("cocreation_sessions").update({ status: "completed" }).eq("id", session.id);
    } catch (e: any) {
      toast({ title: "Synthesis failed", description: e.message, variant: "destructive" });
    } finally {
      setSynthLoading(false);
    }
  };

  const generateVisual = async () => {
    if (!session) return;
    setVisualLoading(true);
    toast({ title: "Creating your visual summary…", description: "This may take 20–40 seconds." });
    try {
      const { data, error } = await supabase.functions.invoke("cocreation-generate-output", {
        body: { session_id: session.id, kind: "visual" },
      });
      if (error) throw error;
      const url = (data as any)?.image_url;
      if (url) setLatestVisual(url);
      toast({ title: "Visual summary ready" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Image generation failed", variant: "destructive" });
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

      <h2 className="text-xl font-semibold mb-4">Live responses</h2>
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
          <Button onClick={runSynthesis} disabled={synthLoading || responses.length === 0}>
            {synthLoading ? "Synthesizing..." : "Run synthesis"}
          </Button>

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
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={generateVisual} disabled={visualLoading}>
              {visualLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              Visual summary
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

          {latestVisual && (
            <div className="border rounded-lg overflow-hidden bg-muted/20">
              <img src={latestVisual} alt="Visual summary" className="w-full h-auto block" />
              <div className="flex items-center justify-between p-3 border-t bg-background">
                <p className="text-xs text-muted-foreground">Latest visual summary</p>
                <a
                  href={latestVisual}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            </div>
          )}
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
