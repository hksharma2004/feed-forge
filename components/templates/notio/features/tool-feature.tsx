"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import BlurredOrb from "@/components/blurred-orb";

type Tool = {
  name: string;
  image: string;
};

export default function ToolFeature() {
  const tools: Tool[] = [
    { name: "X",         image: "/icons/x.svg" },
    { name: "LinkedIn",  image: "/icons/linkedin.svg" },
    { name: "Instagram", image: "/icons/instagram.svg" },
    { name: "TikTok",   image: "/icons/tiktok.svg" },
    { name: "Facebook",  image: "/icons/facebook.svg" },
    { name: "YouTube",   image: "/icons/youtube.svg" },
    { name: "Threads",   image: "/icons/threads.svg" },
    { name: "Pinterest", image: "/icons/pinterest.svg" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full lg:py-20 4xl:py-32"
    >
      <Card className="w-full min-h-96 lg:gap-16 flex flex-col items-center justify-center dark:bg-background max-md:ring-0 dark:ring-1 shadow-none lg:py-18 4xl:gap-24">
        <CardHeader className="relative flex flex-wrap gap-4 md:gap-8 items-center justify-center w-full px-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.07,
                ease: "easeOut",
              }}
              className="relative flex flex-col items-center justify-center gap-2"
            >
              <div className="relative flex items-center justify-center border border-border p-4 bg-background rounded-2xl w-16 h-16 md:w-20 md:h-20 4xl:w-28 4xl:h-28">
                <Image
                  src={tool.image}
                  alt={tool.name}
                  width={48}
                  height={48}
                  className="h-8 w-8 md:h-10 md:w-10 object-contain invert dark:invert-0"
                />
                <BlurredOrb className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:blur-xl blur-lg w-8 h-8 md:h-10 md:w-10 4xl:h-14 4xl:w-14" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{tool.name}</span>
            </motion.div>
          ))}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center justify-center w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="text-center text-3xl md:text-4xl font-aleo 4xl:text-5xl"
          >
            Built for the channels you publish on
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="text-center text-muted-foreground text-lg md:text-base max-w-lg 4xl:text-3xl 4xl:max-w-4xl"
          >
            Shape one campaign brain, then score and generate posts for X,
            LinkedIn, Instagram, TikTok, YouTube, Threads, and more.
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

