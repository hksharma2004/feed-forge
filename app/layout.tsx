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
  title: "FeedForge",
  description: "AI-powered campaign agents for modern creators.",
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
