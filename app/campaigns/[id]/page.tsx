"use client";

import { CampaignNavbar } from "@/components/campaigns/campaign-navbar";
import { useSession } from "@/lib/auth-client";
import { approvePost, generatePosts, getCampaignLibrary, listCampaigns, rejectPost, scorePost } from "@/lib/api";
import type { ApprovedPost, Campaign, CampaignLibrary, GeneratedPost, RejectedPost, Scores } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  Check,
  Edit3,
  ExternalLink,
  Loader2,
  Send,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./campaign-workspace.module.css";

type Tab = "score" | "generate" | "library";
const metrics: Array<keyof Pick<Scores, "like" | "reply" | "repost" | "click" | "block" | "mute">> = [
  "like",
  "reply",
  "repost",
  "click",
  "block",
  "mute",
];
const briefPresets = [
  {
    title: "Launch",
    brief: "Introduce the offer, name the audience, and end with a clear CTA.",
  },
  {
    title: "Pain point",
    brief: "Open with a specific frustration, show the better way, and make it useful.",
  },
  {
    title: "Founder insight",
    brief: "Share a sharp lesson, one concrete example, and a confident takeaway.",
  },
  {
    title: "Feature benefit",
    brief: "Explain one feature through the user outcome it creates.",
  },
  {
    title: "Social proof",
    brief: "Turn a result, testimonial, or customer behavior into a credible post.",
  },
  {
    title: "Contrarian",
    brief: "Challenge a common belief and replace it with a practical point of view.",
  },
];

function percent(value: number) {
  return Math.round(value * 100);
}

function scoreToneClass(score: number) {
  if (score >= 0.7) return styles.scoreGood;
  if (score >= 0.4) return styles.scoreMid;
  return styles.scoreBad;
}

function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.topGlow} />
      <div className={styles.leftGlow} />
      <div className={styles.rightGlow} />
      <div className={styles.bottomGlow} />
      <div className={styles.vignette} />
    </div>
  );
}

function GitAgentFooter() {
  return (
    <footer className={styles.gitagentFooter}>
      <a href="https://github.com/open-gitagent/gitagent" target="_blank" rel="noreferrer">
        Made with gitagents <ExternalLink size={15} strokeWidth={1.9} />
      </a>
    </footer>
  );
}

function MetricBar({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
  return (
    <div className={compact ? styles.metricCompact : styles.metric}>
      <div className={styles.metricHeader}>
        <span>{label}</span>
        <span>{percent(value)}%</span>
      </div>
      <div className={styles.metricTrack}>
        <div className={`${styles.metricFill} ${styles[`metric_${label.toLowerCase()}`]}`} style={{ width: `${percent(value)}%` }} />
      </div>
    </div>
  );
}

function AlgorithmSignalList({ scores, compact = false }: { scores: Scores; compact?: boolean }) {
  const signals = scores.x_algorithm_signals ?? [];
  if (!signals.length) return null;

  return (
    <div className={compact ? styles.signalListCompact : styles.signalList}>
      {signals.slice(0, compact ? 3 : 7).map((signal) => (
        <div key={`${signal.metric}-${signal.characteristic}`} className={styles.signalItem}>
          <div>
            <span>{signal.metric}</span>
            <p>{signal.characteristic}</p>
          </div>
          <strong>{percent(signal.value)}%</strong>
        </div>
      ))}
    </div>
  );
}

function ScorePanel({ scores, onRewrite }: { scores: Scores; onRewrite: (value: string) => void }) {
  return (
    <motion.aside
      className={styles.scorePanel}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div className={styles.scoreHeader}>
        <div>
          <p>Brand Score</p>
          <strong className={scoreToneClass(scores.brand_score)}>{percent(scores.brand_score)}</strong>
        </div>
        <span>/100</span>
      </div>
      <div className={styles.metricGrid}>
        {metrics.map((metric) => (
          <MetricBar key={metric} label={metric[0].toUpperCase() + metric.slice(1)} value={scores[metric]} />
        ))}
      </div>
      <AlgorithmSignalList scores={scores} />
      <div className={styles.rewriteList}>
        {scores.rewrites.map((rewrite) => (
          <button key={rewrite} type="button" onClick={() => onRewrite(rewrite)}>
            {rewrite}
          </button>
        ))}
      </div>
    </motion.aside>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Saved earlier";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved earlier";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function xComposeUrl(text: string) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

function GeneratedCard({
  campaignId,
  ownerId,
  item,
  onSaved,
}: {
  campaignId: string;
  ownerId: string;
  item: GeneratedPost;
  onSaved: () => void;
}) {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | "">("");

  async function approve() {
    setBusy("approve");
    setStatus("");
    try {
      await approvePost({ campaign_id: campaignId, owner_id: ownerId, content: item.content, brand_score: item.scores.brand_score });
      setStatus("Approved into memory");
      onSaved();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setBusy("");
    }
  }

  async function reject() {
    if (!reason.trim()) {
      setStatus("Add a rejection reason first");
      return;
    }
    setBusy("reject");
    setStatus("");
    try {
      await rejectPost({ campaign_id: campaignId, owner_id: ownerId, content: item.content, reason });
      setStatus("Rejected into memory");
      setReason("");
      onSaved();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <motion.article className={styles.generatedCard} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div className={styles.generatedTop}>
        <p>{item.content}</p>
        <strong className={scoreToneClass(item.scores.brand_score)}>{percent(item.scores.brand_score)}</strong>
      </div>
      <div className={styles.miniMetrics}>
        <MetricBar compact label="Like" value={item.scores.like} />
        <MetricBar compact label="Reply" value={item.scores.reply} />
        <MetricBar compact label="Repost" value={item.scores.repost} />
      </div>
      <AlgorithmSignalList scores={item.scores} compact />
      <div className={styles.approvalRow}>
        <button type="button" className={styles.approveButton} onClick={approve} disabled={!!busy}>
          {busy === "approve" ? <Loader2 className={styles.spinner} size={17} /> : <Check size={17} />}
          Approve
        </button>
        <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for rejection" />
        <button type="button" className={styles.rejectButton} onClick={reject} disabled={!!busy}>
          {busy === "reject" ? <Loader2 className={styles.spinner} size={17} /> : <X size={17} />}
          Reject
        </button>
      </div>
      {status ? <p className={styles.statusText}>{status}</p> : null}
    </motion.article>
  );
}

function ApprovedLibraryCard({ item }: { item: ApprovedPost }) {
  return (
    <a className={`${styles.memoryCard} ${styles.publishCard}`} href={xComposeUrl(item.content)} target="_blank" rel="noreferrer">
      <div className={styles.memoryMeta}>
        <span>Selected</span>
        <div className={styles.publishMeta}>
          <ExternalLink size={15} />
          <strong>{Math.round(item.brand_score * 100)}</strong>
        </div>
      </div>
      <p>{item.content}</p>
      <small>{formatDate(item.created_at)}</small>
    </a>
  );
}

function RejectedLibraryCard({ item }: { item: RejectedPost }) {
  return (
    <article className={styles.memoryCard}>
      <div className={styles.memoryMeta}>
        <span>Bin</span>
        <Trash2 size={16} />
      </div>
      <p>{item.content}</p>
      <small>{formatDate(item.created_at)}</small>
      {item.reason ? <div className={styles.memoryReason}>{item.reason}</div> : null}
    </article>
  );
}

export default function CampaignWorkspacePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const campaignId = params.id;
  const { data: session, isPending } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tab, setTab] = useState<Tab>("score");
  const [draft, setDraft] = useState("");
  const [scores, setScores] = useState<Scores | null>(null);
  const [scoreError, setScoreError] = useState("");
  const [scoring, setScoring] = useState(false);
  const [brief, setBrief] = useState("");
  const [generated, setGenerated] = useState<GeneratedPost[]>([]);
  const [generateError, setGenerateError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [library, setLibrary] = useState<CampaignLibrary>({ approved: [], rejected: [] });
  const [libraryError, setLibraryError] = useState("");
  const [libraryLoading, setLibraryLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }
    listCampaigns(session.user.id)
      .then((items) => setCampaign(items.find((item) => item.id === campaignId) || null))
      .catch(() => setCampaign(null));
  }, [campaignId, isPending, router, session?.user]);

  useEffect(() => {
    if (!session?.user || !draft.trim()) {
      setScores(null);
      setScoreError("");
      setScoring(false);
      return;
    }

    setScoring(true);
    const handle = window.setTimeout(() => {
      scorePost({ campaign_id: campaignId, owner_id: session.user.id, draft })
        .then((result) => {
          setScores(result);
          setScoreError("");
        })
        .catch((err) => {
          setScores(null);
          setScoreError(err.message);
        })
        .finally(() => setScoring(false));
    }, 800);

    return () => window.clearTimeout(handle);
  }, [campaignId, draft, session?.user]);

  const title = useMemo(() => campaign?.name || "Campaign workspace", [campaign]);

  async function loadLibrary() {
    if (!session?.user) return;
    setLibraryLoading(true);
    setLibraryError("");
    try {
      setLibrary(await getCampaignLibrary({ campaign_id: campaignId, owner_id: session.user.id }));
    } catch (err) {
      setLibraryError(err instanceof Error ? err.message : "Could not load library");
    } finally {
      setLibraryLoading(false);
    }
  }

  useEffect(() => {
    if (!session?.user) return;
    loadLibrary();
  }, [campaignId, session?.user]);

  async function runGenerate() {
    if (!brief.trim()) return;
    setGenerating(true);
    setGenerateError("");
    try {
      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }
      setGenerated(await generatePosts({ campaign_id: campaignId, owner_id: session.user.id, brief }));
    } catch (err) {
      setGenerated([]);
      setGenerateError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function applyBriefPreset(preset: (typeof briefPresets)[number]) {
    const presetText = `${preset.title}: ${preset.brief}`;
    setBrief((current) => {
      const trimmed = current.trim();
      return trimmed ? `${trimmed}\n\n${presetText}` : presetText;
    });
  }

  if (isPending || !session?.user) {
    return (
      <main className={styles.loadingShell}>
        <Loader2 className={styles.spinner} size={20} />
        Loading your session...
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Background />
      <CampaignNavbar user={session.user} />

      <section className={styles.content}>
        <Link href="/campaigns" className={styles.backLink}>
          <ArrowLeft size={17} />
          Campaigns
        </Link>

        <header className={styles.workspaceHeader}>
          <motion.div
            className={styles.titleBlock}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, ease: "easeOut" }}
          >
            <p>{campaignId}</p>
            <h1>{title}</h1>
            {campaign ? <span>{campaign.platform}</span> : null}
          </motion.div>

          <motion.div
            className={styles.tabSwitch}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.08, ease: "easeOut" }}
          >
            <button className={tab === "score" ? styles.tabActive : ""} type="button" onClick={() => setTab("score")}>
              <Sparkles size={21} />
              Score a Post
            </button>
            <button className={tab === "generate" ? styles.tabActive : ""} type="button" onClick={() => setTab("generate")}>
              <Edit3 size={18} />
              Generate Content
            </button>
            <button className={tab === "library" ? styles.tabActive : ""} type="button" onClick={() => setTab("library")}>
              <Archive size={18} />
              Library
            </button>
          </motion.div>
        </header>

        <div className={styles.headerRule} />

        {tab === "score" ? (
          <section className={scores ? styles.scoreLayoutSplit : styles.scoreLayout}>
            <motion.div
              className={styles.workspaceCard}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <label htmlFor="draft">Paste a draft post to score...</label>
              <textarea
                id="draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Start typing or paste your draft post here..."
              />
              <div className={styles.resultStrip}>
                <Sparkles size={22} />
                <span>{scoring ? "Scoring after the 800ms debounce..." : scoreError || "Scoring results will appear here."}</span>
              </div>
            </motion.div>
            {scores ? <ScorePanel scores={scores} onRewrite={setDraft} /> : null}
          </section>
        ) : tab === "generate" ? (
          <section className={styles.generateLayout}>
            <motion.div className={`${styles.workspaceCard} ${styles.generateComposer}`} initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.composerHeader}>
                <div>
                  <span>Brief builder</span>
                  <label htmlFor="brief">Generate posts</label>
                </div>
                <WandSparkles size={22} />
              </div>
              <div className={styles.presetGrid} aria-label="Brief presets">
                {briefPresets.map((preset) => (
                  <button key={preset.title} type="button" onClick={() => applyBriefPreset(preset)}>
                    <strong>{preset.title}</strong>
                    <span>{preset.brief}</span>
                  </button>
                ))}
              </div>
              <textarea
                id="brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                maxLength={1200}
                placeholder="Pick presets above or write a compact brief: audience, angle, offer, tone, CTA..."
              />
              <div className={styles.generateFooter}>
                <p>{brief.length}/1200 characters. Generates 3 scored variants in one model call.</p>
                <button type="button" onClick={runGenerate} disabled={generating || !brief.trim()}>
                  {generating ? <Loader2 className={styles.spinner} size={18} /> : <Send size={18} />}
                  Generate
                </button>
              </div>
            </motion.div>

            <motion.aside className={styles.generatedDrawer} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}>
              <div className={styles.drawerHeader}>
                <div>
                  <span>{generated.length || 3}</span>
                  <h2>Generated posts</h2>
                </div>
                {generating ? <Loader2 className={styles.spinner} size={18} /> : <Sparkles size={18} />}
              </div>
              {generateError ? <p className={styles.errorBox}>{generateError}</p> : null}
              {generated.length ? (
                <div className={styles.generatedGrid}>
                  {generated.map((item) => (
                    <GeneratedCard key={item.content} campaignId={campaignId} ownerId={session.user.id} item={item} onSaved={loadLibrary} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyGenerated}>
                  <WandSparkles size={24} />
                  <span>{generating ? "Generating scored variants..." : "Generated posts will slide in here."}</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </motion.aside>
          </section>
        ) : (
          <section className={styles.libraryLayout}>
            {libraryError ? <p className={styles.errorBox}>{libraryError}</p> : null}
            <div className={styles.memorySection}>
              <div className={styles.memoryHeader}>
                <div>
                  <span>{library.approved.length}</span>
                  <h2>Selected posts</h2>
                </div>
                {libraryLoading ? <Loader2 className={styles.spinner} size={18} /> : <Check size={18} />}
              </div>
              {library.approved.length ? (
                <div className={styles.memoryList}>
                  {library.approved.map((item) => (
                    <ApprovedLibraryCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyGenerated}>
                  <Check size={22} />
                  <span>Approved posts will appear here.</span>
                </div>
              )}
            </div>

            <div className={styles.memorySection}>
              <div className={styles.memoryHeader}>
                <div>
                  <span>{library.rejected.length}</span>
                  <h2>Rejected bin</h2>
                </div>
                <Trash2 size={18} />
              </div>
              {library.rejected.length ? (
                <div className={styles.memoryList}>
                  {library.rejected.map((item) => (
                    <RejectedLibraryCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyGenerated}>
                  <Trash2 size={22} />
                  <span>Rejected posts stay here for 20 days.</span>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
      <GitAgentFooter />
    </main>
  );
}
