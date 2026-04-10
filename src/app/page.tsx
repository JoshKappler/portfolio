import { CursorGlow } from "@/components/cursor-glow";
import { Hero } from "@/components/hero";
import { SnapContainer } from "@/components/snap-container";
import { ContentSection } from "@/components/content-section";
import { YouTube } from "@/components/youtube";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { NeuralVortexBackground } from "@/components/ui/neural-vortex-background";
import { SmokeBackground } from "@/components/ui/smoke-background";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <SnapContainer sectionCount={5}>
        <Hero index={0} />
        <ContentSection index={1}>
          <YouTube />
        </ContentSection>
        <ContentSection
          index={2}
          background={
            <>
              <NeuralVortexBackground />
              <div className="absolute inset-0 bg-bg/40" />
            </>
          }
        >
          <Projects />
        </ContentSection>
        <ContentSection
          index={3}
          background={
            <>
              <SmokeBackground smokeColor="#c9a96e" />
              <div className="absolute inset-0 bg-bg/50" />
            </>
          }
        >
          <About />
        </ContentSection>
        <ContentSection
          index={4}
          background={
            <>
              <DottedSurface />
              <div className="absolute inset-0 bg-bg/40" />
            </>
          }
        >
          <Contact />
        </ContentSection>
      </SnapContainer>
    </>
  );
}
