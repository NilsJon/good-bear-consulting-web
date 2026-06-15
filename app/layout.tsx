import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Good Bear Consulting | Building What's Next",
  description:
    "Good Bear Consulting helps companies turn ambitious ideas into real products, systems, and capabilities through software engineering and technical expertise.",
  icons: {
    icon: [
      { url: "/logo-sm.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo-sm.png", media: "(prefers-color-scheme: dark)" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo-sm.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
