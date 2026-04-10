import { CursorGlow } from "@/components/cursor-glow";
import { Hero } from "@/components/hero";
import { SnapContainer } from "@/components/snap-container";
import { ContentSection } from "@/components/content-section";
import { YouTube } from "@/components/youtube";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <SnapContainer sectionCount={5}>
        <Hero index={0} />
        <ContentSection index={1}>
          <YouTube />
        </ContentSection>
        <ContentSection index={2}>
          <Projects />
        </ContentSection>
        <ContentSection index={3}>
          <About />
        </ContentSection>
        <ContentSection index={4}>
          <Contact />
        </ContentSection>
      </SnapContainer>
    </>
  );
}
