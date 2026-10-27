import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const description =
  "Software engineer in San Francisco. Production LLM agents and the full-stack products around them. Most recently founding DX Engineer at General Translation.";

export const metadata: Metadata = {
  // Absolute URLs for the social card and canonical, not the deploy host.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
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

/* Browser chrome matches the sheet; /resume overrides to its black. */
export const viewport: Viewport = {
  themeColor: "#f2e8d5",
  colorScheme: "light",
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
