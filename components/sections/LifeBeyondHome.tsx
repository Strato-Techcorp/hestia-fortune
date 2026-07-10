"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { CircularGallery, GalleryItem } from "@/components/ui/CircularGallery";
import { LIFE_BEYOND_HOME } from "@/lib/data";

export default function Amenities() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const galleryItems: GalleryItem[] = LIFE_BEYOND_HOME.map((item) => ({
    common: item.name,
    binomial: item.desc,
    photo: { url: item.image, text: item.name, by: "" },
  }));

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
    if (deltaX > 50) goToPrevious();
    else if (deltaX < -50) goToNext();
    touchStartX.current = null;
  };

  const activeItem = activeIndex !== null ? LIFE_BEYOND_HOME[activeIndex] : null;

  return (
    <section id="amenities" className="bg-canvas py-24 md:py-32 border-t border-divider overflow-hidden">
      <div className="container-px max-w-content mx-auto">
        <div className="mb-16 md:mb-24 text-center overflow-hidden">
          <Reveal>
            <span className="eyebrow">Amenities</span>
          </Reveal>
          <h2 className="mt-4 font-display text-ink text-section-md md:text-section leading-[1.1] tracking-[-1.5px]">
            <span className="block italic font-normal">Life</span>
            <span className="block">
              <span className="text-accent-hover font-semibold">Beyond</span>{" "}
              <span className="text-muted italic font-normal">Home</span>
            </span>
          </h2>
        </div>

        <div className="w-full" style={{ height: "38rem" }}>
          <CircularGallery
            items={galleryItems}
            onItemClick={(i) => setActiveIndex(i)}
          />
        </div>
      </div>

      {/* Pop-out modal — unchanged from your original */}
      {activeItem && (
        <div onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 backdrop-blur-sm px-4 animate-[fadeIn_0.3s_ease-out]">
          <div onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-3xl animate-[popIn_0.35s_cubic-bezier(0.25,0.1,0.25,1)]">
            <button onClick={() => setActiveIndex(null)}
              className="absolute -top-10 right-0 text-surface/60 hover:text-surface transition-colors" aria-label="Close">
              <X size={22} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute top-1/2 -left-4 sm:-left-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
              aria-label="Previous amenity">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute top-1/2 -right-4 sm:-right-14 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-surface/10 bg-ink/50 text-surface/70 backdrop-blur-sm transition-colors hover:text-surface hover:border-accent/40"
              aria-label="Next amenity">
              <ChevronRight size={20} />
            </button>
            <div className="relative h-[70vh] w-full overflow-hidden border border-surface/10 bg-ink">
              <Image key={activeItem.image} src={activeItem.image} alt={activeItem.name} fill className="object-cover" />
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
                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-surface/25 hover:bg-surface/40"
                  }`}
                  aria-label={`Go to ${LIFE_BEYOND_HOME[i].name}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </section>
  );
}