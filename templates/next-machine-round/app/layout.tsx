import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/ui/Nav";

// next/font: self-hosted, zero CLS, no external request at runtime
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Next Machine Round",
    template: "%s | Next Machine Round",
  },
  description:
    "Next.js 15 App Router interview workspace — RSC, Server Actions, Streaming, Caching, ISR, Auth, Edge, Middleware",
  openGraph: {
    title: "Next Machine Round",
    description: "Next.js 15 interview workspace",
    type: "website",
  },
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
