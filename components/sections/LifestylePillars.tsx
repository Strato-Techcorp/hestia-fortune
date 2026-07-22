"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { LIFESTYLE_PILLARS } from "@/lib/data";

function SlideContent({
  pillar,
  index,
  slideCount,
  progress,
}: {
  pillar: (typeof LIFESTYLE_PILLARS)[number];
  index: number;
  slideCount: number;
  progress: MotionValue<number>;
}) {
  // Each slide owns an equal slice of overall progress (matches the linear
  // x-translation math below). Content fades in as its slide becomes
  // active and fades out as the next one takes over -- driven by the same
  // scrollYProgress that drives the pan, so there's one source of truth
  // and no per-text-block IntersectionObserver competing with the
  // translateX animation (that was the main cause of the jank).
  const start = index / slideCount;
  const end = (index + 1) / slideCount;
  const fadeIn = start + (end - start) * 0.18;
  const fadeOut = end - (end - start) * 0.18;

  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, fadeIn, fadeOut, end], [40, 0, 0, -40]);
  const dividerScale = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="relative z-10 container-px max-w-content mx-auto text-surface"
    >
      <div className="absolute top-0 right-0">
        <span className="label-text !tracking-[0.3em] text-surface/30">
          {String(index + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
        </span>
      </div>

      <h2 className="font-display italic font-light text-6xl md:text-7xl lg:text-[8rem] leading-[0.88] tracking-[-0.04em] text-surface">
        {pillar.title}
      </h2>

      <motion.div
        style={{ scaleX: dividerScale, willChange: "transform" }}
        className="mt-6 h-px w-12 origin-left bg-accent"
      />

      <p className="mt-5 max-w-md text-base font-light leading-relaxed text-surface/80">
        {pillar.desc}
      </p>
    </motion.div>
  );
}

export default function LifestylePillars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideCount = LIFESTYLE_PILLARS.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooths raw scroll input (wheel ticks, trackpad momentum) into a
  // fluid motion value instead of snapping 1:1 to scroll position -- this
  // is the direct fix for the pan feeling rigid/laggy while scrolling.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.4,
  });

  // Track/travel math derives from slideCount so it stays correct as
  // slides are added or removed.
  const trackWidthVw = slideCount * 100;
  const travelPercent = ((slideCount - 1) / slideCount) * 100;
  const x = useTransform(smoothProgress, [0, 1], ["0%", `-${travelPercent}%`]);

  const sectionHeightDvh = slideCount * 100;

  return (
    <section
      id="lifestyle"
      ref={containerRef}
      className="relative bg-ink overflow-x-clip"
      style={{ height: `${sectionHeightDvh}dvh` }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          style={{ x, width: `${trackWidthVw}vw`, willChange: "transform" }}
          className="flex h-full"
        >
          {LIFESTYLE_PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="relative flex h-full w-screen items-center overflow-hidden">
              {/* IMAGE -- fills the entire sticky viewport */}
              <div className="absolute inset-0">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>

              {/* OVERLAY -- gradient for text contrast + a light accent tint for mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute inset-0 bg-accent/10" />

              {/* CONTENT -- now driven by the same progress value as the pan */}
              <SlideContent
                pillar={pillar}
                index={index}
                slideCount={slideCount}
                progress={smoothProgress}
              />
            </div>
          ))}
        </motion.div>

        {/* SKIP -- lets users who don't want to scroll through every slide jump
            straight to the next section. Plain anchor so SmoothScroll's global
            click handler picks it up and animates via Lenis; no new wiring needed.
            Breathing pulse (same keyframe used on other site CTAs) draws the eye
            without being distracting or changing its resting size. */}
        <a
          href="#brochure"
          className="absolute bottom-8 right-6 md:right-10 z-20 inline-flex items-center gap-2 px-5 py-2.5 label-text !tracking-[0.2em] text-surface/70 border border-surface/20 bg-ink/30 backdrop-blur-sm transition-colors duration-300 hover:text-surface hover:border-surface/40 animate-[breathe_2.6s_ease-in-out_infinite]"
        >
          Skip
          <ChevronDown size={14} />
        </a>
      </div>

      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </section>
  );
}