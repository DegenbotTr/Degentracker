import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DegenHub — Home for Traders Bots",
  description:
    "A growing collection of fast, focused Telegram trading bots for degens — across Solana and EVM chains (Ethereum, BSC, Base, Arbitrum). Real-time wallet tracking, multi-chain token cards, and on-chain alerts, plus a community of traders.",
  keywords: [
    "Solana",
    "Ethereum",
    "BSC",
    "Base",
    "Arbitrum",
    "EVM",
    "Telegram bot",
    "trading bot",
    "wallet tracker",
    "token scanner",
    "on-chain alerts",
    "DegenHub",
  ],
  openGraph: {
    title: "DegenHub — Home for Traders Bots",
    description:
      "A growing collection of Telegram trading bots across Solana and EVM chains. Real-time wallet tracking, multi-chain token cards, and a community of traders.",
    images: ["/degenlogo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DegenHub — Home for Traders Bots",
    description:
      "Telegram trading bots across Solana and EVM chains, plus a community of traders.",
    images: ["/degenlogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
