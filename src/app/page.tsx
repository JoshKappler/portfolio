import { CursorGlow } from "@/components/cursor-glow";
import { SiteBackground } from "@/components/site-background";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { YouTube } from "@/components/youtube";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <SiteBackground />
      <CursorGlow />
      <main className="relative">
        <Hero />
        <Projects />
        <YouTube />
        <About />
        <Contact />
      </main>
    </>
  );
}
