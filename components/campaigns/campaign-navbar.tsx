"use client";

import { authClient } from "@/lib/auth-client";
import type { CampaignUser } from "@/lib/types";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useState } from "react";
import styles from "./campaign-navbar.module.css";

function FeedForgeLogo() {
  return (
    <span className={styles.logoWrap}>
      <Image
        src="/logo/feedforge-logo.png"
        alt="FeedForge"
        width={180}
        height={50}
        className={styles.logoFull}
        priority
      />
    </span>
  );
}


function UserPill({ user }: { user: CampaignUser }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const name = user.name || "Harsh Sharma";
  const email = user.email || "harsh.sharma.biz@gmail.com";
  const initial = name.slice(0, 1).toUpperCase();

  async function logOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className={styles.userPill}>
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.userText}>
        <p>{name}</p>
        <span>{email}</span>
      </div>
      <button className={styles.iconButton} type="button" onClick={logOut} disabled={signingOut} aria-label="Log out">
        <LogOut size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function CampaignNavbarComponent({ user }: { user: CampaignUser }) {
  const pathname = usePathname();
  const activeItem = pathname === "/campaigns/new" ? "agents" : "campaigns";

  return (
    <motion.header
      className={styles.navbar}
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Link href="/campaigns" className={styles.brandLink}>
        <FeedForgeLogo />
      </Link>

      <nav className={styles.navLinks} aria-label="Dashboard navigation">
        <Link
          className={`${styles.navLink} ${activeItem === "campaigns" ? styles.navLinkActive : ""}`}
          href="/campaigns"
        >
          Campaigns
        </Link>
        <Link
          className={`${styles.navLink} ${activeItem === "agents" ? styles.navLinkActive : ""}`}
          href="/campaigns/new"
        >
          Agents <ChevronDown size={16} strokeWidth={1.9} />
        </Link>
      </nav>

      <div className={styles.navActions}>
        <Link href="/campaigns/new" className={styles.newCampaignButton}>
          <Plus size={21} strokeWidth={2.1} />
          <span>New Campaign</span>
        </Link>
        <UserPill user={user} />
      </div>
    </motion.header>
  );
}

export const CampaignNavbar = memo(CampaignNavbarComponent);
