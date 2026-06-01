import { themesConfig } from "@/components/templates/notio/notio-themes";
import { ThemeVariables } from "@/components/theme/theme-variables";
import { ThemeProvider } from "@/components/theme-provider";
import { Aleo } from "next/font/google";
import type { Metadata } from "next";
import "./index.css";

const aleo = Aleo({ subsets: ["latin"], variable: "--font-notio-aleo" });
const notioSansFont =
  '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, ui-sans-serif, sans-serif';

export const metadata: Metadata = {
  metadataBase: new URL("https://feedforge.harsh1.tech"),
  title: "FeedForge",
  description:
    "Build campaign agents, score drafts against your brand rules, and generate content that learns from every approval.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FeedForge",
    description:
      "Forge every post before it ships with AI-powered campaign agents.",
    url: "/",
    siteName: "FeedForge",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FeedForge landing page preview with the headline Forge Every Post Before It Ships.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FeedForge",
    description:
      "Forge every post before it ships with AI-powered campaign agents.",
    images: [
      {
        url: "/opengraph-image",
        alt: "FeedForge landing page preview with the headline Forge Every Post Before It Ships.",
      },
    ],
  },
  icons: {
    icon: "/logo/feedforge-icon.png",
    shortcut: "/logo/feedforge-icon.png",
    apple: "/logo/feedforge-icon.png",
  },
};

export default function NotioTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${aleo.variable} min-h-screen bg-background text-foreground`}
        style={{ fontFamily: notioSansFont }}
      >
        <div
          className={`${aleo.variable} min-h-screen bg-background text-foreground`}
          style={{ fontFamily: notioSansFont }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeVariables themesConfig={themesConfig} colorTheme="sunny" />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
