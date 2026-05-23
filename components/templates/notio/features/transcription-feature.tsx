"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { AnimatedList } from "@/components/animated-list";
import BlurredOrb from "@/components/blurred-orb";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const transcriptions = [
  {
    time: "01",
    text: "Hot take: your content calendar is not the strategy. It is the receipt.",
  },
  {
    time: "02",
    text: "The strategy is the agent that remembers what your audience rewards and ignores.",
  },
  {
    time: "03",
    text: "Score drafts for reply intent, shareability, and spam risk before they go live.",
  },
  {
    time: "04",
    text: "Then approve the best posts so the next batch gets sharper.",
  },
];

function TranscriptionItem({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex items-start 4xl:gap-8 relative">
      <span className="text-muted-foreground/60 font-mono text-xs shrink-0 pt-1 w-6 lg:w-6 xl:w-10 text-right 4xl:text-2xl">
        {time}
      </span>
      <div
        aria-hidden="true"
        className="absolute top-6 left-5 h-[90%] w-px lg:left-6"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--foreground) 22%, transparent)",
        }}
      />
      <div className="relative pl-6 pb-6 last:pb-0">
        <p className="text-foreground/80 leading-relaxed text-xs lg:text-sm 4xl:text-2xl">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function TranscriptionFeature() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center w-full mx-auto p-6 pb-12 md:px-4 lg:px-20 xl:px-16 md:pb-12 lg:py-8 rounded-4xl mt-15 md:mt-20 lg:mt-0 overflow-hidden max-lg:bg-gradient-to-b max-lg:from-background max-lg:via-background max-lg:dark:via-secondary/30 max-lg:via-secondary/10 max-lg:to-primary/40 max-lg:dark:to-secondary/60"
    >
      <BlurredOrb className="max-lg:hidden absolute left-180 top-120 rounded-full w-full h-280 dark:opacity-40 opacity-10 rotate-45 from-secondary via-primary to-secondary blur-3xl" />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 md:gap-8 xl:gap-24 max-w-7xl">
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex-1 space-y-6 text-center lg:text-left z-10"
        >
          <h2 className="text-2xl md:text-4xl 4xl:text-5xl font-aleo tracking-tight text-foreground">
            Generators create options. <br />
            FeedForge builds taste.
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Every campaign gets a voice file, rules file, platform context, and
            approval memory. The system learns what to repeat and what to avoid.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative flex-1 w-full flex justify-center lg:justify-end isolate rounded-3xl sm:px-4 lg:px-0 lg:mb-8"
        >
          <div className="w-full max-w-sm 4xl:max-w-2xl p-[1px] rounded-3xl bg-gradient-to-r from-primary/40 via-primary/20 to-muted-foreground/10">
            <Card className="w-full min-h-64 lg:min-h-96 4xl:min-h-[60dvh] dark:bg-background backdrop-blur-sm overflow-hidden relative rounded-3xl border-0 ring-0">
            <div className="p-4 lg:px-8 lg:py-6 pb-24 lg:pb-32">
              <div className="mb-8">
                <p className="text-sm text-foreground leading-relaxed 4xl:text-2xl">
                  Rejected: too generic, sounded like a launch checklist, no
                  concrete audience tension.
                </p>
                <div
                  aria-hidden="true"
                  className="md:mt-4 h-px w-full shrink-0"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--foreground) 14%, transparent)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 md:gap-8">
                <AnimatedList
                  delay={1000}
                  reverse={false}
                  className="lg:gap-4 4xl:gap-12"
                >
                  {transcriptions.map((item) => (
                    <TranscriptionItem
                      key={item.time}
                      time={item.time}
                      text={item.text}
                    />
                  ))}
                </AnimatedList>

                <div className="border-l border-border/40 pl-6 w-full space-y-2">
                  <Skeleton className="h-2.5 rounded-full w-3/4 4xl:h-6 4xl:w-full dark:bg-white/40" />
                  <Skeleton className="h-2.5 rounded-full w-1/2 4xl:h-6 4xl:w-full dark:bg-white/40" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 lg:bottom-14 left-0 right-0 flex justify-center z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative flex items-center gap-3 dark:bg-background bg-white px-3 md:px-5 py-2.5 rounded-full border border-primary/70 shadow-[0_0_41.9px_0_var(--orb-color-dark-fade)] dark:shadow-[0_0_41.9px_0_var(--orb-color-dark)] 4xl:px-10 4xl:py-5">
                  <BlurredOrb className="absolute inset-0 dark:blur-xl rounded-full w-full h-full opacity-20" />
                  <Image
                    src="/logo/feedforge-icon.png"
                    alt="FeedForge"
                    width={20}
                    height={20}
                    className="size-4 lg:size-6 4xl:size-10 dark:invert-0 invert"
                  />
                  <span className="text-xs md:text-sm font-medium text-foreground/90 4xl:text-2xl">
                    Updating campaign memory
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
          </Card>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
