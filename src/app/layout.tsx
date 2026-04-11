import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider, ThemeToggle } from "@/components/theme-provider";
import "./globals.css";


const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Josh Kappler",
  description:
    "I build AI agents from scratch. 2.1M YouTube subscribers. No frameworks.",
  openGraph: {
    title: "Josh Kappler",
    description:
      "Building autonomous AI agents from scratch. 2.1M YouTube subscribers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Kappler",
    description:
      "Building autonomous AI agents from scratch. 2.1M YouTube subscribers.",
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
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
