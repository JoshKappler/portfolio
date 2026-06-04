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
  title: "Josh Kappler · AI Engineer & Developer Advocate",
  description:
    "I build autonomous AI agents from scratch, and I can explain them to 2.1M people. Open to AI engineering and developer advocacy roles.",
  openGraph: {
    title: "Josh Kappler · AI Engineer & Developer Advocate",
    description:
      "AI engineer who builds autonomous agents from scratch. 2.1M YouTube subscribers. Open to engineering and developer advocacy roles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Kappler · AI Engineer & Developer Advocate",
    description:
      "AI engineer who builds autonomous agents from scratch. 2.1M YouTube subscribers. Open to engineering and developer advocacy roles.",
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
