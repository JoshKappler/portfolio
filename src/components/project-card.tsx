"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

interface ProjectProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  highlights: string[];
  link?: string;
  linkLabel?: string;
  screenshot?: string;
  gallery?: string[];
  accentColor?: string;
}

export function ProjectCard({
  index,
  title,
  subtitle,
  description,
  techStack,
  highlights,
  link,
  linkLabel,
  screenshot,
  gallery,
  accentColor = "var(--color-accent)",
}: ProjectProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="relative border border-white/[0.08] rounded-3xl overflow-hidden bg-bg/60 backdrop-blur-xl hover:border-white/[0.14] transition-all duration-700">
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
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="font-mono text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: accentColor,
                    borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
                  }}
                >
                  {String(index).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-text-dim tracking-widest uppercase">
                  {subtitle}
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                {title}
              </h3>
            </div>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 mt-2 px-4 py-2 font-mono text-xs border border-border rounded-full text-text-dim hover:text-accent hover:border-accent/40 transition-all duration-300"
              >
                {linkLabel || "View"} &rarr;
              </a>
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
              className="mb-8 -mx-2 overflow-hidden"
            >
              <div className="flex gap-3 overflow-x-auto pb-3 px-2 scrollbar-hide">
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 w-40 h-56 md:w-48 md:h-64 rounded-xl overflow-hidden border border-border/30"
                  >
                    <Image
                      src={img}
                      alt={`${title} output ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
              <p className="mt-2 px-2 font-mono text-[10px] text-text-dim tracking-wider">
                AI-generated output from the pipeline
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
                className="px-3 py-1.5 text-xs font-mono text-text-dim border border-border/60 rounded-full hover:border-border-hover hover:text-text-muted transition-colors duration-300"
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
