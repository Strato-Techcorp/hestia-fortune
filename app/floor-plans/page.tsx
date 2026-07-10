"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { VILLA_CATEGORIES, VillaCategoryKey } from "@/lib/data";

function FloorPlansContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") as VillaCategoryKey | null;

  const [active, setActive] = useState<VillaCategoryKey>(
    initial && VILLA_CATEGORIES.some((c) => c.key === initial) ? initial : VILLA_CATEGORIES[0].key
  );

  // Keep the active tab in sync if the query param changes after the page has mounted
  // (e.g. navigating here again from another villa card while already on this route).
  useEffect(() => {
    if (initial && VILLA_CATEGORIES.some((c) => c.key === initial)) {
      setActive(initial);
    }
  }, [initial]);

  const current = VILLA_CATEGORIES.find((c) => c.key === active) ?? VILLA_CATEGORIES[0];

  return (
    <section className="bg-canvas min-h-screen py-20 md:py-28 border-t border-divider">
      <div className="container-px max-w-content mx-auto">
        {/* Header */}
        <div className="text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="w-10 h-px bg-ink/25" />
              <span className="label-text text-muted">Fortune Hestia</span>
              <span className="w-10 h-px bg-ink/25" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 font-display text-ink text-section-md md:text-section leading-[1.05] tracking-[-1.5px]">
              <span className="italic font-normal">View</span>{" "}
              <span className="font-semibold relative inline-block">
                Floor Plans
                <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-accent/50 -z-10" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 body-text max-w-md mx-auto">
              Luxury villas designed with precision, space, and modern elegance.
            </p>
          </Reveal>
        </div>

        {/* Category pills */}
        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {VILLA_CATEGORIES.map((c) => {
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={`px-5 py-2.5 rounded-full label-text border transition-colors duration-300 ${
                    isActive
                      ? "bg-accent border-accent text-ink hover:bg-accent-hover hover:border-accent-hover"
                      : "border-divider text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Gallery */}
        <div className="mt-16">
          <div className="flex items-center gap-6">
            <span className="label-text text-muted whitespace-nowrap">Gallery</span>
            <span className="flex-1 h-px bg-divider" />
            <span className="font-display italic text-lg text-ink whitespace-nowrap">
              {current.label}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {current.images.map((src, i) => (
              <Reveal key={src} delay={i * 0.08}>
                <div className="relative">
                  <ParallaxImage
                    src={src}
                    alt={`${current.label} ${i + 1}`}
                    className="aspect-[4/3] bg-surface border border-divider transition-colors duration-300 hover:border-accent"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    intensity={40}
                  />
                  <span className="absolute top-4 left-4 bg-accent-soft/70 backdrop-blur-sm text-ink label-text px-2.5 py-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FloorPlansPage() {
  return (
    <Suspense fallback={null}>
      <FloorPlansContent />
    </Suspense>
  );
}