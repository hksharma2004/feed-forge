"use client";

import { CampaignNavbar } from "@/components/campaigns/campaign-navbar";
import { useSession } from "@/lib/auth-client";
import { listCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./campaigns-dashboard.module.css";

type StatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
};

function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.topGlow} />
      <div className={styles.rightGlow} />
      <div className={styles.bottomGlow} />
      <div className={styles.vignette} />
    </div>
  );
}

function WorkspaceBadge() {
  return (
    <motion.div
      className={styles.workspaceBadge}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
    >
      <Users size={19} strokeWidth={1.9} />
      <span>FeedForge workspace</span>
    </motion.div>
  );
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  return (
    <motion.article
      className={styles.statCard}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.16 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.statGlow} />
      <div className={styles.statIcon}>
        <item.icon size={23} strokeWidth={1.9} />
      </div>
      <div>
        <p className={styles.statLabel}>{item.label}</p>
        <p className={styles.statValue}>{item.value}</p>
      </div>
    </motion.article>
  );
}

function CampaignCard({ campaign, formattedDate, index }: { campaign: Campaign; formattedDate: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link href={`/campaigns/${campaign.id}`} className={styles.campaignCard}>
        <div className={styles.campaignGlow} />
        <div className={styles.campaignTop}>
          <span className={styles.platformBadge}>
            <span className={styles.platformMark}>𝕏</span>
            {campaign.platform}
          </span>
          <span className={styles.cardAction}>
            <FileText size={25} strokeWidth={1.8} />
          </span>
        </div>
        <div className={styles.campaignContent}>
          <h3>{campaign.name}</h3>
          <p>{formattedDate}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.section
      className={styles.emptyCard}
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className={styles.emptyGlow} />
      <div className={styles.emptyInner}>
        <div className={styles.emptyIcon}>
          <BriefcaseBusiness size={34} strokeWidth={1.7} />
        </div>
        <h3>No campaigns yet</h3>
        <p>Create your first AI campaign agent and start turning ideas into launch-ready outreach workflows.</p>
        <div className={styles.emptyActions}>
          <Link href="/campaigns/new" className={styles.emptyPrimary}>
            Create campaign <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.section>
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

export default function CampaignsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formatter = useMemo(
    () => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    []
  );

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }

    listCampaigns(session.user.id)
      .then(setCampaigns)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isPending, router, session?.user]);

  if (isPending || !session?.user) {
    return (
      <main className={styles.loadingShell}>
        <Loader2 className={styles.spinner} size={20} />
        Loading your session...
      </main>
    );
  }

  const stats: StatItem[] = [
    { label: "Active Campaigns", value: String(campaigns.length), icon: BriefcaseBusiness },
    { label: "Agents Running", value: campaigns.length ? String(campaigns.length) : "0", icon: Zap },
    { label: "Workspace", value: "Ready", icon: CheckCircle2 },
  ];

  return (
    <main className={styles.page}>
      <Background />
      <CampaignNavbar user={session.user} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <WorkspaceBadge />
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.68, delay: 0.08, ease: "easeOut" }}
          >
            Campaigns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          >
            Welcome back, {session.user.name || "Harsh"}. Build, manage, and launch AI campaign agents from one focused workspace.
          </motion.p>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <p>Dashboard</p>
            <h2>Your Campaigns</h2>
          </div>
          <div className={styles.headerRule} />
        </div>

        {error ? (
          <div className={styles.errorCard}>API unavailable: {error}</div>
        ) : loading ? (
          <div className={styles.loadingCards}>
            <div />
            <div />
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.campaignGrid}>
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                formattedDate={formatter.format(new Date(campaign.created_at))}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
      <GitAgentFooter />
    </main>
  );
}
