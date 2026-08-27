import type { Metadata } from "next";
import "./globals.css";

const description =
  "Developer tools and AI agents. First DX Engineer at General Translation. Previously grew a YouTube channel to 2.1M subscribers.";

export const metadata: Metadata = {
  title: "Josh Kappler",
  description,
  openGraph: {
    title: "Josh Kappler",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Kappler",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
