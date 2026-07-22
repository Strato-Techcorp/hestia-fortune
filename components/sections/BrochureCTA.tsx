"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Download } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";
import LeadForm from "@/components/ui/LeadForm";
import ParallaxImage from "@/components/ui/ParallaxImage";

const SLIDES = [
  {
    src: "/images/6.png",
    alt: "Fortune Hestia villa architecture",
    caption: "Villa Elevation",
  },
  {
    src: "/images/b1.png",
    alt: "Fortune Hestia luxury living room",
    caption: "Living Spaces",
  },
  {
    src: "/images/livingspaces (2).jpg",
    alt: "Fortune Hestia landscaped gardens",
    caption: "Garden & Courtyard",
  },
  {
    src: "/images/b3.png",
    alt: "Fortune Hestia swimming pool",
    caption: "Resort-Style Pool",
  },
  {
    src: "/images/b2.png",
    alt: "Fortune Hestia premium interiors",
    caption: "Premium Interiors",
  },
];

const SWIPE_THRESHOLD = 60;
const AUTOPLAY_INTERVAL = 2000;
const RESUME_DELAY = 500;

export default function BrochureCTA() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const indexRef = useRef(index);
  indexRef.current = index;
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHovering = useRef(false);

  const handleSuccess = () => {
    const link = document.createElement("a");
    link.href = "/downloads/Fortune_Hestia (6).pdf";
    link.download = "Fortune-Hestia-Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goTo = (nextIndex: number) => {
    if (nextIndex === indexRef.current) return;
    setDirection(nextIndex > indexRef.current ? 1 : -1);
    setIndex((nextIndex + SLIDES.length) % SLIDES.length);
  };

  // Autoplay: advances every AUTOPLAY_INTERVAL ms, pauses on hover/drag/manual nav
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goTo(indexRef.current + 1);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  const pauseTemporarily = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    setIsPaused(true);
    resumeTimeout.current = setTimeout(() => {
      if (!isHovering.current) setIsPaused(false);
    }, RESUME_DELAY);
  };

  const handleManualNav = (nextIndex: number) => {
    goTo(nextIndex);
    pauseTemporarily();
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    pauseTemporarily();
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goTo(indexRef.current + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goTo(indexRef.current - 1);
    }
    pauseTemporarily();
  };

  return (
    <section id="brochure" className="bg-canvas py-24 md:py-36 border-t border-divider">
      <div className="container-px max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Copy */}
        <div className="lg:col-span-5 lg:col-start-1 order-1 lg:order-1">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Contemporary Villas</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-ink text-section-sm md:text-section-md leading-[1.08]">
              Designed for
              <br />
              Timeless Living
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-7 body-text max-w-md">
              Designed with care and crafted for modern families, every villa
              brings together contemporary architecture, open spaces and
              timeless comfort, creating a home that welcomes you with warmth
              every day.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="mt-4 body-text max-w-md text-ink/60">
              Thoughtfully located off Sarjapur Road, with seamless
              connectivity to Bengaluru&rsquo;s leading IT hubs, renowned
              schools and everyday conveniences.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 flex items-center gap-5">
              <button
                onClick={() => setOpen(true)}
                className="btn-primary inline-flex items-center gap-2.5 animate-[breathe_2.6s_ease-in-out_infinite]"
              >
                <Download size={16} strokeWidth={2} />
                Download Brochure
              </button>
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink/45">
                PDF &middot; 8 MB
              </span>
            </div>
          </Reveal>
        </div>

        {/* Framed image slider, mat-board style */}
        <div className="lg:col-span-7 lg:col-start-6 order-2 lg:order-2">
          <Reveal delay={0.15}>
            <div className="relative">
              <div
                className="relative bg-surface border border-divider p-3 md:p-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                      key={index}
                      custom={direction}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                      initial={{ x: direction >= 0 ? "100%" : "-100%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction >= 0 ? "-100%" : "100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={handleDragEnd}
                    >
                      <ParallaxImage
                        src={SLIDES[index].src}
                        alt={SLIDES[index].alt}
                        className="h-full w-full"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        intensity={70}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Prev / Next arrows */}
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => handleManualNav(index - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-divider bg-canvas/80 text-ink backdrop-blur-sm transition hover:bg-canvas"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => handleManualNav(index + 1)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-divider bg-canvas/80 text-ink backdrop-blur-sm transition hover:bg-canvas"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {SLIDES.map((slide, i) => (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={`Go to photo ${i + 1}`}
                      onClick={() => handleManualNav(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Caption row, beneath the frame like a gallery placard */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  {SLIDES[index].caption}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  Fortune Hestia
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <LeadForm
          title="Download the Brochure"
          subtitle="Enter your details and the brochure will download automatically."
          submitLabel="Download Now"
          thankYou="Thank you — your download has started."
          onSuccess={handleSuccess}
        />
      </Modal>

      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </section>
  );
}