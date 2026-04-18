import { CursorGlow } from "@/components/cursor-glow";
import { Hero } from "@/components/hero";
import { SnapContainer } from "@/components/snap-container";
import { ContentSection } from "@/components/content-section";
import { YouTube } from "@/components/youtube";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { ThemedEtheralShadow, ThemedNeuralVortex, ThemedSmoke, ThemedDottedSurface } from "@/components/themed-backgrounds";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <SnapContainer sectionCount={5}>
        <Hero index={0} />
        <ContentSection
          index={1}
          background={<ThemedNeuralVortex />}
        >
          <Projects />
        </ContentSection>
        <ContentSection index={2} background={<ThemedEtheralShadow />}>
          <YouTube />
        </ContentSection>
        <ContentSection
          index={3}
          background={<ThemedSmoke smokeColor="#c9a96e" />}
        >
          <About />
        </ContentSection>
        <ContentSection
          index={4}
          background={<ThemedDottedSurface />}
        >
          <Contact />
        </ContentSection>
      </SnapContainer>
    </>
  );
}
