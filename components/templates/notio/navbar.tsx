"use client";
import { AnimatePresence, motion } from "motion/react";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems: { label: string; href: string }[] = [
  { label: "Agents", href: "#agents" },
  { label: "Scoring", href: "#scoring" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-3 top-3 z-50 mx-auto max-w-6xl rounded-xl border border-border/60 bg-background/85 px-4 py-1 shadow-sm backdrop-blur-md md:inset-x-6 md:top-4"
    >
      <div className="flex flex-row justify-between items-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/logo/feedforge-logo.png"
            className="dark:invert-0 invert"
            alt="FeedForge"
            width={124}
            height={35}
          />
        </motion.div>

        <div className="hidden md:flex flex-row items-center gap-4 4xl:gap-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.1 + index * 0.1,
              }}
            >
              <Link
                href={item.href}
                className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 0.1 + navItems.length * 0.1,
            }}
          >
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign in
            </Link>
          </motion.div>
          <ThemeToggle />
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 0.2 + navItems.length * 0.1,
            }}
          >
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "4xl:h-12 4xl:px-6 4xl:text-2xl"
              )}
            >
              Sign up
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:hidden"
        >
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <XIcon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuIcon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col gap-4 py-4"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: navItems.length * 0.1 }}
                className="flex flex-col gap-2 pt-2"
              >
                <div className="flex justify-center pb-1">
                  <ThemeToggle />
                </div>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full"
                  )}
                >
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default memo(Navbar);
