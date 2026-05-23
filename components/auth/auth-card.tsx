"use client";

import OrbBackground from "@/components/orb-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type AuthMode = "sign-in" | "sign-up";

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | "">("");

  const isSignUp = mode === "sign-up";
  const callbackURL = useMemo(() => {
    if (typeof window === "undefined") return "/campaigns";
    return `${window.location.origin}/campaigns`;
  }, []);

  async function signInWithGoogle() {
    setError("");
    setLoading("google");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (result.error) {
        setError(result.error.message || "Google sign-in failed");
        setLoading("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading("");
    }
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading("email");
    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL,
          })
        : await authClient.signIn.email({
            email,
            password,
            callbackURL,
          });

      if (result.error) {
        setError(result.error.message || "Authentication failed");
        return;
      }
      router.push("/campaigns");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <OrbBackground />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-secondary/30 bg-background shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-[620px] flex-col justify-between bg-hero-radial-light p-10 dark:bg-hero-radial-dark lg:flex">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image src="/logo/feedforge-logo.png" alt="FeedForge" width={160} height={44} className="dark:invert-0 invert" />
          </Link>
          <div>
            <p className="mb-4 w-fit rounded-full border bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em]">
              Session workspace
            </p>
            <h1 className="font-aleo text-5xl leading-none">
              Your campaigns, your memory.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-foreground/75">
              Sign in and FeedForge will show only your campaign agents, with your Google name and image in the dashboard.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="lg:hidden">
              <Image src="/logo/feedforge-icon.png" alt="FeedForge" width={38} height={38} className="dark:invert-0 invert" />
            </Link>
            <Link href={isSignUp ? "/auth/login" : "/auth/signup"} className="ml-auto text-sm font-medium text-muted-foreground hover:text-foreground">
              {isSignUp ? "Sign in" : "Create account"}
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              {isSignUp ? "Create your FeedForge account" : "Sign in to FeedForge"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isSignUp
                ? "Start a private campaign dashboard backed by Better Auth."
                : "Continue to your campaign dashboard, approval queue, and scoring workspace."}
            </p>
          </div>

          <Button
            variant="outline"
            className="h-11 w-full gap-2 font-normal"
            onClick={signInWithGoogle}
            disabled={!!loading}
          >
            {loading === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or use email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submitEmail} className="flex flex-col gap-4">
            {isSignUp ? (
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                type="text"
                placeholder="Your name"
                className="h-11"
              />
            ) : null}
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              placeholder="Email address"
              className="h-11"
            />
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              type="password"
              placeholder="Password"
              className="h-11"
            />
            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button className="h-11 w-full" disabled={!!loading}>
              {loading === "email" ? <Loader2 className="animate-spin" /> : null}
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
            <Link href={isSignUp ? "/auth/login" : "/auth/signup"} className="font-medium text-foreground hover:underline">
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
