"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { VILLA_DESIGN_DATA, PlotKey, FacingKey } from "@/lib/data";

const PLOT_TABS: { key: PlotKey; label: string }[] = [
  { key: "40x60", label: "40 × 60 Villas" },
  { key: "50x80", label: "50 × 80 Villas" },
];

const FACING_TABS: { key: FacingKey; label: string }[] = [
  { key: "north", label: "North Villas" },
  { key: "south", label: "South Villas" },
  { key: "east", label: "East Villas" },
  { key: "west", label: "West Villas" },
];

// Which image set the lightbox is currently browsing.
type LightboxSource = "cover" | "facing";

export default function VillaDesigns() {
  const [plotType, setPlotType] = useState<PlotKey>("40x60");
  const [facing, setFacing] = useState<FacingKey>("north");
  const [lightbox, setLightbox] = useState<{ source: LightboxSource; index: number } | null>(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const activePlot = VILLA_DESIGN_DATA.find((p) => p.key === plotType) ?? VILLA_DESIGN_DATA[0];
  const coverImage = activePlot.facingCovers?.[facing];
  const facingImages = activePlot.facings?.[facing] ?? [];

  // The lightbox for the cover image is just a single-item array so the
  // same prev/next/keyboard logic works without special-casing it.
  const activeImages = lightbox?.source === "cover" ? [coverImage].filter(Boolean) as string[] : facingImages;
  const activeLabel = `${activePlot.label} — ${FACING_TABS.find((t) => t.key === facing)?.label}`;

  const goToNext = useCallback(() => {
    setLightbox((l) => (l ? { ...l, index: (l.index + 1) % activeImages.length } : l));
  }, [activeImages.length]);

  const goToPrevious = useCallback(() => {
    setLightbox((l) =>
      l ? { ...l, index: (l.index - 1 + activeImages.length) % activeImages.length } : l
    );
  }, [activeImages.length]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    if (lightbox === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox, goToNext, goToPrevious]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) goToPrevious();
    else if (deltaX < -50) goToNext();
    touchStartX.current = null;
  };

  const handlePlotChange = (key: PlotKey) => {
    setPlotType(key);
    setShowcaseIndex(0);
    setLightbox(null);
  };
  const handleFacingChange = (key: FacingKey) => {
    setFacing(key);
    setShowcaseIndex(0);
    setLightbox(null);
  };

  // Bottom showcase: cycles through every image within the current facing
  // (North has 1, South/East/West have 4 each) before rolling over to the
  // next/previous facing, keeping the tabs above in sync.
  const facingIndex = FACING_TABS.findIndex((t) => t.key === facing);
  const showcaseImages = activePlot.facingShowcase[facing];
  const bottomImageSrc = showcaseImages[showcaseIndex];

  const goToNextFacing = () => {
    if (showcaseIndex < showcaseImages.length - 1) {
      setShowcaseIndex((i) => i + 1);
      return;
    }
    const nextFacing = FACING_TABS[(facingIndex + 1) % FACING_TABS.length].key;
    setFacing(nextFacing);
    setShowcaseIndex(0);
    setLightbox(null);
  };

  const goToPreviousFacing = () => {
    if (showcaseIndex > 0) {
      setShowcaseIndex((i) => i - 1);
      return;
    }
    const prevFacing = FACING_TABS[(facingIndex - 1 + FACING_TABS.length) % FACING_TABS.length].key;
    const prevImages = activePlot.facingShowcase[prevFacing];
    setFacing(prevFacing);
    setShowcaseIndex(prevImages.length - 1);
    setLightbox(null);
  };

  return (
    <section id="villas" className="bg-canvas min-h-screen py-20 md:py-28 border-t border-divider">
      <div className="container-px max-w-content mx-auto">
        {/* Header */}
        <div className="text-center">
          <Reveal>
            <span className="eyebrow">Fortune Hestia</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 font-display text-ink text-section-md md:text-section leading-[1.1] tracking-[-1px]">
              Choose Your <span className="italic text-accent-hover">Villa Facing</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 body-text max-w-md mx-auto">
              Explore villas by plot size and orientation across the estate.
            </p>
          </Reveal>
        </div>

        {/* Top pill tabs -- plot size */}
        <Reveal delay={0.3}>
          <div className="mt-12 flex items-center justify-center gap-3">
            {PLOT_TABS.map((tab) => {
              const isActive = tab.key === plotType;
              return (
                <button
                  key={tab.key}
                  onClick={() => handlePlotChange(tab.key)}
                  className={`px-6 py-2.5 rounded-full label-text border transition-colors duration-300 ${isActive
                      ? "bg-ink border-ink text-surface"
                      : "border-divider text-muted hover:border-ink hover:text-ink"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Body: left facing tabs + right content (cover image + facing grid) */}
        <Reveal delay={0.35}>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-[220px_1px_1fr] gap-8 md:gap-10">
            {/* Left facing tabs -- horizontal scroller on mobile, stacked column on desktop */}
            <div className="-mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible scrollbar-hide snap-x snap-mandatory pb-1 md:pb-0">
                {FACING_TABS.map((tab) => {
                  const isActive = tab.key === facing;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleFacingChange(tab.key)}
                      className={`shrink-0 snap-start px-5 py-3 rounded-full text-left label-text border transition-colors duration-300 whitespace-nowrap ${isActive
                          ? "bg-accent border-accent text-ink"
                          : "border-divider text-muted hover:border-accent hover:text-ink"
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
                <div className="shrink-0 w-1 md:hidden" aria-hidden />
              </div>
            </div>

            {/* Vertical divider -- desktop only */}
            <div className="hidden md:block bg-divider" />

            {/* Right column: cover image for this facing, then its 6-photo grid */}
            {/* Right column: 6-photo grid, then cover image at the end */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {facingImages.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setLightbox({ source: "facing", index: i })}
                    className="group relative"
                  >
                    <ParallaxImage
                      src={src}
                      alt={`${activeLabel} ${i + 1}`}
                      className="aspect-[4/3] border border-divider transition-colors duration-300 group-hover:border-accent"
                      imageClassName="transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      intensity={30}
                    />
                    <span className="absolute top-3 left-3 bg-accent-soft/70 backdrop-blur-sm text-ink label-text px-2 py-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom facing showcase -- arrow-navigable. North shows a single
                  image; South/East/West cycle through 4 images each before
                  rolling over to the next facing. Sourced from
                  activePlot.facingShowcase in lib/data.ts. */}
              <div className="relative mt-6 group">
                <div className="relative aspect-[21/9] w-full overflow-hidden border border-divider bg-accent-soft/40">
                  {bottomImageSrc ? (
                    <Image
                      key={bottomImageSrc}
                      src={bottomImageSrc}
                      alt={`${FACING_TABS.find((t) => t.key === facing)?.label} showcase`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted label-text">
                      Image coming soon
                    </div>
                  )}

                  <span className="absolute top-4 left-4 bg-accent-soft/70 backdrop-blur-sm text-ink label-text px-2.5 py-1">
                    {FACING_TABS.find((t) => t.key === facing)?.label}
                  </span>

                  {showcaseImages.length > 1 && (
                    <span className="absolute top-4 right-4 bg-ink/50 backdrop-blur-sm text-surface label-text px-2.5 py-1">
                      {String(showcaseIndex + 1).padStart(2, "0")} / {String(showcaseImages.length).padStart(2, "0")}
                    </span>
                  )}

                  <button
                    onClick={goToPreviousFacing}
                    className="absolute top-1/2 left-3 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                    aria-label="Previous facing"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextFacing}
                    className="absolute top-1/2 right-3 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                    aria-label="Next facing"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  {FACING_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleFacingChange(tab.key)}
                      aria-label={tab.label}
                      className={`h-1.5 rounded-full transition-all duration-300 ${tab.key === facing ? "w-6 bg-ink" : "w-1.5 bg-divider hover:bg-ink/40"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Full-image lightbox popup -- shared by cover + facing galleries */}
      {lightbox && activeImages[lightbox.index] && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-sm px-4 animate-[fadeIn_0.3s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-4xl animate-[popIn_0.35s_cubic-bezier(0.25,0.1,0.25,1)]"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-surface/60 hover:text-surface transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {activeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute top-1/2 -left-4 sm:-left-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute top-1/2 -right-4 sm:-right-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="relative aspect-[4/3] w-full overflow-hidden border border-surface/10 bg-ink">
              <Image
                key={activeImages[lightbox.index]}
                src={activeImages[lightbox.index]}
                alt={`${activeLabel} ${lightbox.index + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {activeImages.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="label-text text-surface/50">
                  {String(lightbox.index + 1).padStart(2, "0")} / {String(activeImages.length).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

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