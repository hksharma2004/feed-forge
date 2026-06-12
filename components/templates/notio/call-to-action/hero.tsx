"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mt-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative isolate flex flex-col items-center justify-center w-full py-32 md:py-44 lg:py-56 px-6 md:px-12 min-h-[70vh] overflow-hidden rounded-4xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 -z-10 bg-hero-radial-light dark:bg-hero-radial-dark 
             [--bg-pos:5%] lg:[--bg-pos:5%] 
             [--bg-mid:55%] md:[--bg-mid:45%] 
             [--bg-mid-alt:75%] lg:[--bg-mid-alt:70%]"
        />

        <section className="flex flex-col gap-6 z-10 text-center items-center max-w-2xl 4xl:max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-[2.7rem] xl:text-5xl font-aleo"
          >
            Forge Every Post Before It Ships
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-base max-w-lg 4xl:text-2xl 4xl:max-w-3xl"
          >
            Build campaign agents, score drafts against your brand rules, and
            generate content that learns from every approval.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-fit hover:bg-white hover:text-foreground dark:hover:bg-secondary/80 dark:hover:text-foreground 4xl:h-16 4xl:px-6 4xl:text-2xl"
              )}
            >
              Create campaign
            </Link>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
