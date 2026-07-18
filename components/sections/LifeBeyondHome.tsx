"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";
import LeadForm from "@/components/ui/LeadForm";
import { LIFE_BEYOND_HOME } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function getCardDimensions(width: number): { w: number; h: number } {
  if (width < 480) return { w: 10, h: 13 };
  if (width < 640) return { w: 13, h: 17 };
  if (width < 768) return { w: 15, h: 20 };
  if (width < 1024) return { w: 18, h: 24 };
  return { w: 22, h: 28 };
}

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  const { h } = getCardDimensions(width);
  const idealPx = h * 16;
  const available = window.innerHeight * 0.7;
  return available >= idealPx ? 1 : available / idealPx;
}

function getContainerHeight(width: number): string {
  if (width < 480) return "18rem";
  if (width < 640) return "22rem";
  if (width < 768) return "26rem";
  if (width < 1024) return "30rem";
  return "38rem";
}

function getSlotConfig(totalCards: number, slot: number) {
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function Amenities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalCards = LIFE_BEYOND_HOME.length;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const getVisibleMap = useCallback(() => {
    const map = new Map<number, number>();
    LIFE_BEYOND_HOME.forEach((_, i) => map.set(i, i));
    return map;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const container = containerRef.current;
    if (!section || !heading || !container) return;

    // The fan-card layout is desktop/tablet-only (see the `hidden lg:block`
    // wrapper below) -- on phones we render a carousel instead, so skip all
    // of this GSAP setup there entirely rather than animating hidden nodes.
    if (window.innerWidth < 1024) return;

    const cardElements = Array.from(
      container.querySelectorAll<HTMLElement>(".fan-card")
    );
    const visibleMap = getVisibleMap();

    const applyCardDimensions = () => {
      const { w, h } = getCardDimensions(window.innerWidth);
      cardElements.forEach((card) => {
        card.style.width = `${w}rem`;
        card.style.height = `${h}rem`;
      });
      if (container) {
        container.style.height = getContainerHeight(window.innerWidth);
      }
    };
    applyCardDimensions();

    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const config = (slot: number) => getSlotConfig(totalCards, slot);

    gsap.set(heading, { opacity: 0, x: 80, filter: "blur(8px)" });

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      if (slot !== undefined) {
        gsap.set(card, {
          x: 0,
          y: `${12 * hMult}rem`,
          rotation: 0,
          scale: 0.5,
          opacity: 0,
        });
      }
    });

    let hoverSetupTimer: NodeJS.Timeout;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(heading, {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
        });

        cardElements.forEach((card, cardIndex) => {
          const slot = visibleMap.get(cardIndex);
          if (slot === undefined) return;
          const { x, y, rot, scale, zIndex } = config(slot);
          gsap.to(card, {
            x: `${x * multiplier}rem`,
            y: `${y * hMult}rem`,
            rotation: rot,
            scale,
            opacity: 1,
            zIndex,
            duration: 1.2,
            ease: "elastic.out(1.05,.78)",
            delay: 0.3 + slot * 0.06,
          });
        });

        const visibleEntries: { el: HTMLElement; slot: number }[] = [];
        cardElements.forEach((el, i) => {
          const slot = visibleMap.get(i);
          if (slot !== undefined) visibleEntries.push({ el, slot });
        });
        visibleEntries.sort((a, b) => a.slot - b.slot);

        const centerSlot = visibleEntries.length >> 1;
        let activeSlot: number | null = null;
        let leaveTimer: NodeJS.Timeout | null = null;
        const entranceDuration = (0.3 + (totalCards - 1) * 0.06 + 1.2) * 1000;

        const updateHoverLayout = (hoveredSlot: number | null) => {
          const mult = getResponsiveMultiplier(window.innerWidth);
          const hM = getHeightMultiplier(window.innerWidth);

          visibleEntries.forEach(({ el, slot }) => {
            const base = config(slot);
            let targetX = base.x * mult;
            let targetY = base.y * hM;
            let targetRot = base.rot;
            let targetScale = base.scale;
            let delay = 0;

            if (hoveredSlot !== null) {
              const distance = Math.abs(slot - hoveredSlot);
              delay = distance * 0.02;

              if (slot === hoveredSlot) {
                targetY -= 2.5 * hM;
                targetScale *= 1.08;
              } else {
                const normalized =
                  centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
                const pushStrength =
                  8 *
                  (1 - Math.abs(normalized)) *
                  (1 + 0.2 * Math.max(0, 3 - distance));

                if (slot < hoveredSlot) {
                  targetX -= pushStrength * mult;
                  targetRot -= 3 / (distance + 1);
                } else {
                  targetX += pushStrength * mult;
                  targetRot += 3 / (distance + 1);
                }

                if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot)
                  targetY -= 1 * hM;
                if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
              }
            } else {
              delay = Math.abs(slot - centerSlot) * 0.02;
            }

            gsap.to(el, {
              x: `${targetX}rem`,
              y: `${targetY}rem`,
              rotation: targetRot,
              scale: targetScale,
              duration: 0.5,
              delay,
              ease: "elastic.out(1,.75)",
              overwrite: "auto",
            });
            gsap.set(el, { zIndex: base.zIndex });
          });
        };

        hoverSetupTimer = setTimeout(() => {
          const enterHandlers = visibleEntries.map(({ el, slot }) => {
            const handler = () => {
              if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
              if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
            };
            el.addEventListener("mouseenter", handler);
            return { el, handler };
          });

          const onMouseLeave = () => {
            if (leaveTimer) clearTimeout(leaveTimer);
            leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
          };
          container.addEventListener("mouseleave", onMouseLeave);

          const onResize = () => {
            applyCardDimensions();
            updateHoverLayout(activeSlot);
          };
          window.addEventListener("resize", onResize);

          (container as any)._hoverCleanup = () => {
            enterHandlers.forEach(({ el, handler }) =>
              el.removeEventListener("mouseenter", handler)
            );
            container.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("resize", onResize);
            if (leaveTimer) clearTimeout(leaveTimer);
          };
        }, entranceDuration);
      },
    });

    return () => {
      trigger.kill();
      clearTimeout(hoverSetupTimer);
      (container as any)._hoverCleanup?.();
    };
  }, [getVisibleMap, totalCards]);

  const goToNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % LIFE_BEYOND_HOME.length));
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + LIFE_BEYOND_HOME.length) % LIFE_BEYOND_HOME.length
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";

    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, goToNext, goToPrevious]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;
    if (deltaX > SWIPE_THRESHOLD) goToPrevious();
    else if (deltaX < -SWIPE_THRESHOLD) goToNext();
    touchStartX.current = null;
  };

  const activeItem = activeIndex !== null ? LIFE_BEYOND_HOME[activeIndex] : null;

  // --- Mobile carousel (replaces the fan layout below the lg breakpoint) ---
  const [mobileIndex, setMobileIndex] = useState(0);
  const [enquiryItem, setEnquiryItem] = useState<string | null>(null);
  const mobileTouchStartX = useRef<number | null>(null);

  const goToNextMobile = useCallback(() => {
    setMobileIndex((i) => (i + 1) % LIFE_BEYOND_HOME.length);
  }, []);

  const goToPreviousMobile = useCallback(() => {
    setMobileIndex((i) => (i - 1 + LIFE_BEYOND_HOME.length) % LIFE_BEYOND_HOME.length);
  }, []);

  const handleMobileTouchStart = (e: React.TouchEvent) => {
    mobileTouchStartX.current = e.touches[0].clientX;
  };

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    if (mobileTouchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - mobileTouchStartX.current;
    const SWIPE_THRESHOLD = 40;
    if (deltaX > SWIPE_THRESHOLD) goToPreviousMobile();
    else if (deltaX < -SWIPE_THRESHOLD) goToNextMobile();
    mobileTouchStartX.current = null;
  };

  const mobileItem = LIFE_BEYOND_HOME[mobileIndex];

  return (
    <section id="amenities" ref={sectionRef} className="bg-canvas py-24 md:py-32 border-t border-divider overflow-hidden">
      <div className="container-px max-w-content mx-auto">

        {/* Header -- matches site typography: eyebrow + font-display heading */}
        <div className="mb-16 md:mb-24 text-center overflow-hidden">
          <Reveal>
            <span className="eyebrow">Amenities</span>
          </Reveal>
          <h2
            ref={headingRef}
            className="mt-4 font-display text-ink text-section-md md:text-section leading-[1.1] tracking-[-1.5px] will-change-transform"
          >
            <span className="block italic font-normal">Life</span>
            <span className="block">
              <span className="text-accent-hover font-semibold">Beyond</span>{" "}
              <span className="text-muted italic font-normal">Home</span>
            </span>
          </h2>
        </div>

        {/* Fan layout -- desktop/tablet (lg and up). Phones get the arrow
            carousel below instead. */}
        <div
          ref={containerRef}
          className="relative hidden lg:flex items-center justify-center w-full"
          style={{ height: "38rem" }}
        >
          {LIFE_BEYOND_HOME.map((item, index) => (
            <div
              key={item.name}
              onClick={() => setActiveIndex(index)}
              className="fan-card group absolute cursor-pointer"
              style={{ width: "22rem", height: "28rem" }}
            >
              <div className="relative w-full h-full overflow-hidden border border-divider bg-ink shadow-[0_8px_40px_rgba(18,18,18,0.35)] transition-colors duration-500 group-hover:border-accent/50">
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 group-hover:from-ink/80 group-hover:via-ink/30 transition-all duration-700" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6">
                  <span className="label-text !text-[10px] !tracking-[0.25em] text-surface/40 group-hover:text-surface/60 transition-colors duration-500 mb-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display italic font-light text-xl sm:text-2xl leading-snug text-accent">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm font-sans font-light leading-relaxed text-surface/55 group-hover:text-surface/80 transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/tablet carousel -- same arrow-navigable, dot-indicator
            language as the Villa Designs facing showcase, so the amenities
            section reads consistently with the rest of the site on phones.
            Each slide carries a small "Know More" CTA that opens the lead
            form modal for that amenity. */}
        <div className="lg:hidden">
          <div
            className="relative group"
            onTouchStart={handleMobileTouchStart}
            onTouchEnd={handleMobileTouchEnd}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden border border-divider bg-ink">
              <Image
                key={mobileItem.image}
                src={mobileItem.image}
                alt={mobileItem.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />

              <span className="absolute top-4 left-4 bg-ink/50 backdrop-blur-sm text-surface/70 label-text !text-[10px] !tracking-[0.25em] px-2.5 py-1">
                {String(mobileIndex + 1).padStart(2, "0")} / {String(LIFE_BEYOND_HOME.length).padStart(2, "0")}
              </span>

              <button
                onClick={goToPreviousMobile}
                className="absolute top-1/2 left-3 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                aria-label="Previous amenity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextMobile}
                className="absolute top-1/2 right-3 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                aria-label="Next amenity"
              >
                <ChevronRight size={20} />
              </button>

              <div className="relative z-10 flex flex-col justify-end h-full p-5 sm:p-7">
                <h3 className="font-display italic font-light text-2xl sm:text-3xl leading-snug text-accent">
                  {mobileItem.name}
                </h3>
                <p className="mt-2 max-w-sm text-sm font-sans font-light leading-relaxed text-surface/70">
                  {mobileItem.desc}
                </p>

                
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {LIFE_BEYOND_HOME.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to ${item.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === mobileIndex ? "w-6 bg-ink" : "w-1.5 bg-divider hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Pop-out image overlay with prev/next navigation */}
      {activeItem && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 backdrop-blur-sm px-4 animate-[fadeIn_0.3s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-3xl animate-[popIn_0.35s_cubic-bezier(0.25,0.1,0.25,1)]"
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute -top-10 right-0 text-surface/60 hover:text-surface transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute top-1/2 -left-4 sm:-left-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
              aria-label="Previous amenity"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute top-1/2 -right-4 sm:-right-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
              aria-label="Next amenity"
            >
              <ChevronRight size={20} />
            </button>

            <div className="relative h-[70vh] w-full overflow-hidden border border-surface/10 bg-ink">
              <Image
                key={activeItem.image}
                src={activeItem.image}
                alt={activeItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="label-text !text-[10px] !tracking-[0.3em] text-surface/40">
                  {String(activeIndex! + 1).padStart(2, "0")} / {String(LIFE_BEYOND_HOME.length).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display italic font-light text-3xl sm:text-4xl text-accent leading-snug">
                  {activeItem.name}
                </h3>
                <p className="mt-2 max-w-md text-sm font-sans font-light leading-relaxed text-surface/60">
                  {activeItem.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              {LIFE_BEYOND_HOME.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-surface/25 hover:bg-surface/40"
                  }`}
                  aria-label={`Go to ${LIFE_BEYOND_HOME[i].name}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* "Know More" enquiry form, opened from the mobile carousel's CTA */}
      <Modal open={enquiryItem !== null} onClose={() => setEnquiryItem(null)}>
        <LeadForm
          title={enquiryItem ? `Know More — ${enquiryItem}` : "Know More"}
          subtitle="Share your details and our team will send you the full details."
          submitLabel="Request Details"
        />
      </Modal>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}