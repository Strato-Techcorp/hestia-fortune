"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";
import LeadForm from "@/components/ui/LeadForm";
import { CircularGallery, GalleryItem } from "@/components/ui/CircularGallery";
import { LIFE_BEYOND_HOME } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Amenities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Map the amenity data into the shape CircularGallery expects.
  const galleryItems: GalleryItem[] = useMemo(
    () =>
      LIFE_BEYOND_HOME.map((item) => ({
        common: item.name,
        binomial: item.desc,
        photo: {
          url: item.image,
          text: item.name,
          by: "",
        },
      })),
    []
  );

  // Only the heading intro animation remains here now -- the fan-card
  // slot/hover choreography is gone since the desktop view is handled by
  // CircularGallery, which drives its own rotation off scroll position.
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    gsap.set(heading, { opacity: 0, x: 80, filter: "blur(8px)" });

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
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

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

  // --- Mobile carousel (unchanged -- CircularGallery is desktop/tablet only) ---
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

        {/* Circular 3D gallery -- desktop/tablet (lg and up). Phones get the
            arrow carousel below instead. Rotation is driven by page scroll
            (with gentle auto-rotate when idle); clicking a card opens the
            same pop-out lightbox the old fan layout used. */}
        <div
          ref={galleryContainerRef}
          className="relative hidden lg:block w-full"
          style={{ height: "38rem" }}
        >
          <CircularGallery
            items={galleryItems}
            radius={480}
            autoRotateSpeed={0.03}
            className="w-full h-full"
            onItemClick={(index) => setActiveIndex(index)}
          />
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