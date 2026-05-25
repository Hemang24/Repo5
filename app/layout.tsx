import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecideAI — Weighted Decision Matrix",
  description:
    "Make confident, data-driven decisions with AI-powered weighted analysis, devil's advocate pressure testing, and personalized synthesis.",
  keywords: ["decision making", "weighted matrix", "AI", "decision analysis"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#020817] antialiased">{children}</body>
    </html>
  );
}
