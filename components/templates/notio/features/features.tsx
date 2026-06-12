"use client";

import { FeatureCardProps } from "@/types/components/feature";
import { GitBranch, ShieldCheck, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import FeatureCard from "./feature-card";
import ToolFeature from "./tool-feature";
import TranscriptionFeature from "./transcription-feature";

const features: FeatureCardProps[] = [
  {
    title: "Create campaign agents",
    description:
      "Turn brand voice, ICP, content rules, and platform into a gitagent repo with durable campaign memory.",
    icon: GitBranch,
  },
  {
    title: "Score before publishing",
    description:
      "Preview like, reply, repost, click, block, mute, and brand score before a post reaches the feed.",
    icon: ShieldCheck,
  },
  {
    title: "Generate with memory",
    description:
      "Use approved posts as style signals and rejected posts as guardrails for sharper variants.",
    icon: Sparkle,
  },
];

function Features() {
  return (
    <div
      id="agents"
      className="flex scroll-mt-28 flex-col items-center justify-center gap-8 p-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl 4xl:text-6xl font-aleo text-center"
      >
        One workspace for campaign content
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="text-lg text-center max-w-2xl text-muted-foreground 4xl:text-3xl 4xl:max-w-6xl"
      >
        From agent setup to final approval, FeedForge keeps every draft,
        score, rewrite, and memory update in one focused flow.
      </motion.p>
      <section className="flex flex-wrap items-stretch justify-center gap-4 max-md:pt-8 md:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.2 + index * 0.15,
              ease: "easeOut",
            }}
          >
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </section>
      <ToolFeature />
      <TranscriptionFeature />
    </div>
  );
}

export default memo(Features);
