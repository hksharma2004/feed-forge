"use client";

import { CampaignNavbar } from "@/components/campaigns/campaign-navbar";
import { useSession } from "@/lib/auth-client";
import { createCampaign } from "@/lib/api";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Loader2,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./new-campaign.module.css";

const formSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  voice: z.string().min(10, "Give the agent a little more voice context"),
  icp: z.string().min(10, "Describe the ideal customer"),
  rules: z.string().min(5, "Add at least one content rule"),
  platform: z.enum(["X/Twitter", "LinkedIn", "Instagram"]),
});

type FormValues = z.infer<typeof formSchema>;
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={styles.fieldError}>{message}</p>;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { platform: "X/Twitter" },
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/auth/login");
    }
  }, [isPending, router, session?.user]);

  async function onSubmit(values: FormValues) {
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }
    setApiError("");
    try {
      const result = await createCampaign({ ...values, owner_id: session.user.id });
      router.push(`/campaigns/${result.campaign_id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unable to create campaign");
    }
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

        <motion.div
          className={styles.heroBlock}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: "easeOut" }}
        >
          <div className={styles.badge}>
            <Sparkles size={15} />
            <span>New Agent</span>
          </div>
          <h1>Campaign Creator</h1>
          <p>FeedForge will initialize a gitagent repo, write the agent identity and rules, and create approval memory.</p>
        </motion.div>

        <motion.form
          className={styles.formCard}
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.1, ease: "easeOut" }}
        >
          <div className={styles.field}>
            <label htmlFor="name">Brand name</label>
            <input id="name" {...register("name")} placeholder="Acme Analytics" />
            <FieldError message={errors.name?.message} />
          </div>

          <div className={styles.field}>
            <label htmlFor="voice">Brand voice</label>
            <textarea
              id="voice"
              {...register("voice")}
              placeholder="Describe how your brand speaks - tone, style, personality"
            />
            <FieldError message={errors.voice?.message} />
          </div>

          <div className={styles.field}>
            <label htmlFor="icp">Ideal customer</label>
            <textarea id="icp" {...register("icp")} placeholder="Who should this content feel written for?" />
            <FieldError message={errors.icp?.message} />
          </div>

          <div className={styles.field}>
            <label htmlFor="rules">Content rules</label>
            <textarea id="rules" {...register("rules")} placeholder="What to always do / never do" />
            <FieldError message={errors.rules?.message} />
          </div>

          <div className={styles.field}>
            <label htmlFor="platform">Platform</label>
            <div className={styles.selectWrap}>
              <select id="platform" {...register("platform")}>
                <option>X/Twitter</option>
                <option>LinkedIn</option>
                <option>Instagram</option>
              </select>
              <ChevronDown size={17} />
            </div>
          </div>

          {apiError ? <p className={styles.apiError}>{apiError}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className={styles.spinner} size={18} /> : <WandSparkles size={18} />}
            <span>Create Campaign</span>
          </button>
        </motion.form>
      </section>
      <GitAgentFooter />
    </main>
  );
}
