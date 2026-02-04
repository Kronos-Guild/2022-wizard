import type { Metadata } from "next";
import Image from "next/image";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { MeasurementGrid } from "@/components/measurement-grid";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Local Clash Display font for better performance (no external request)
const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/clash-display-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/clash-display-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/clash-display-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

const siteUrl = "https://2022wizard.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "2022 Wizard - Token-2022 Anchor Program Generator",
    template: "%s | 2022 Wizard",
  },
  description:
    "Generate secure, production-ready Token-2022 Anchor programs from audited building blocks. Configure extensions, preview code, and export complete projects.",
  keywords: [
    "Token-2022",
    "Solana",
    "Anchor",
    "Program Generator",
    "SPL Token",
    "Rust",
    "Smart Contract",
    "Token Extensions",
    "Transfer Fee",
    "Metadata",
    "Kronos Guild",
  ],
  authors: [{ name: "Kronos Guild", url: "https://kronosguild.com" }],
  creator: "Kronos Guild",
  publisher: "Kronos Guild",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "2022 Wizard",
    title: "2022 Wizard - Token-2022 Anchor Program Generator",
    description:
      "Generate secure, production-ready Token-2022 Anchor programs from audited building blocks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "2022 Wizard - Token-2022 Anchor Program Generator",
    description:
      "Generate secure, production-ready Token-2022 Anchor programs from audited building blocks.",
    creator: "@KronosGuild",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${clashDisplay.variable} relative antialiased min-h-screen flex flex-col`}
      >
        <NuqsAdapter>
          <ThemeProvider>
            <MeasurementGrid className="fixed inset-0 -z-20" />
            
            {/* Top left corner dashed line */}
            <svg
              className="pointer-events-none fixed top-6 left-6 z-0 h-[120px] w-[120px] text-foreground opacity-15 dark:opacity-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0"
                y1="0"
                x2="120"
                y2="120"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="8,6"
              />
            </svg>

            {/* Bottom right corner dashed line */}
            <svg
              className="pointer-events-none fixed bottom-6 right-6 z-0 h-[120px] w-[120px] text-foreground opacity-15 dark:opacity-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="120"
                y1="0"
                x2="0"
                y2="120"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="8,6"
              />
            </svg>
            
            <header className="relative z-50 flex items-center justify-center px-4 py-4">
              <div
                className="px-3 py-1 font-bold uppercase tracking-[0.25em] text-foreground/60"
                style={{ fontFamily: "var(--font-clash)" }}
              >
                2022 Wizard
              </div>
              <div className="absolute right-4">
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-[0.2em] text-foreground/60">
              <span>by</span>
              <Image
                src="/kronos-logo-dark.svg"
                alt="Kronos"
                width={64}
                height={16}
                className="h-4 w-auto opacity-70 dark:hidden"
              />
              <Image
                src="/kronos-logo-light.svg"
                alt="Kronos"
                width={64}
                height={16}
                className="hidden h-4 w-auto opacity-70 dark:block"
              />
            </footer>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
