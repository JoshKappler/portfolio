"use client";

import { motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "./theme-provider";

interface ProjectProps {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  highlights: string[];
  link?: string;
  linkLabel?: string;
  secondaryLink?: string;
  secondaryLinkLabel?: string;
  screenshot?: string;
  gallery?: string[];
  galleryCaption?: string;
  galleryLandscape?: boolean;
  accentColor?: string;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

export function ProjectCard({
  title,
  subtitle,
  description,
  techStack,
  highlights,
  link,
  linkLabel,
  secondaryLink,
  secondaryLinkLabel,
  screenshot,
  gallery,
  galleryCaption = "AI-generated output from the pipeline",
  galleryLandscape = false,
  accentColor = "var(--color-accent)",
}: ProjectProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { theme } = useTheme();
  const isLight = theme === "light";

  const galleryRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, [updateScroll]);

  const scrollGallery = (dir: 1 | -1) => {
    const el = galleryRef.current;
    if (!el) return;
    const item = el.querySelector("div");
    const step = item ? item.clientWidth + 12 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className={`relative border rounded-3xl overflow-hidden transition-all duration-700 ${
        isLight
          ? "border-border bg-bg-card hover:border-border-hover"
          : "border-border/60 bg-bg-card/50 backdrop-blur-xl hover:border-border-hover"
      }`}>
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
          }}
        />

        <div className="p-8 md:p-10 lg:p-12">
          {/* Header row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-accent">
                {title}
              </h3>
              <p className="font-mono text-xs text-text-dim tracking-widest uppercase mt-3">
                {subtitle}
              </p>
            </div>
            {(link || secondaryLink) && (
              <div className="flex shrink-0 items-center gap-2 mt-2">
                {secondaryLink && (
                  <a
                    href={secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 font-mono text-xs rounded-full border border-accent/45 bg-accent/10 text-accent transition-all duration-300 hover:bg-accent hover:text-bg"
                  >
                    {secondaryLinkLabel || "Demo"} &rarr;
                  </a>
                )}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 font-mono text-xs rounded-full border border-accent/45 text-accent transition-all duration-300 hover:bg-accent/10 hover:border-accent"
                  >
                    {linkLabel || "View"} &rarr;
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Screenshot if available */}
          {screenshot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-8 rounded-xl overflow-hidden border border-border/40"
            >
              <div className="relative aspect-video bg-bg-elevated">
                <Image
                  src={screenshot}
                  alt={`${title} screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              {/* Reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* Gallery */}
          {gallery && gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 -mx-2"
            >
              <div className="relative">
                <div
                  ref={galleryRef}
                  onScroll={updateScroll}
                  className="flex gap-3 overflow-x-auto pb-3 px-2 scrollbar-hide"
                >
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className={`relative shrink-0 rounded-xl overflow-hidden border border-border/30 ${
                        galleryLandscape
                          ? "w-72 h-[11.25rem] md:w-96 md:h-60"
                          : "w-40 h-56 md:w-48 md:h-64"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${title} output ${i + 1}`}
                        fill
                        className={galleryLandscape ? "object-cover object-top" : "object-cover"}
                        sizes={galleryLandscape ? "384px" : "200px"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
                {canScroll.left && (
                  <button
                    type="button"
                    aria-label="Previous screenshots"
                    onClick={() => scrollGallery(-1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-accent/40 bg-bg/80 backdrop-blur flex items-center justify-center text-accent hover:bg-accent hover:text-bg transition-all duration-300"
                  >
                    <Chevron dir="left" />
                  </button>
                )}
                {canScroll.right && (
                  <button
                    type="button"
                    aria-label="Next screenshots"
                    onClick={() => scrollGallery(1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-accent/40 bg-bg/80 backdrop-blur flex items-center justify-center text-accent hover:bg-accent hover:text-bg transition-all duration-300"
                  >
                    <Chevron dir="right" />
                  </button>
                )}
              </div>
              <p className="mt-2 px-2 font-mono text-[10px] text-text-dim tracking-wider">
                {galleryCaption}
              </p>
            </motion.div>
          )}

          {/* Description */}
          <p className="text-text-muted leading-relaxed mb-8 max-w-3xl text-base md:text-lg">
            {description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-mono text-accent border border-accent/30 rounded-full hover:border-accent/60 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Technical details */}
          <div className="pt-6 border-t border-border/40">
            <p className="font-mono text-[10px] text-text-dim tracking-[0.3em] uppercase mb-5">
              Technical Details
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <span
                    className="mt-2 w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  {h}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
