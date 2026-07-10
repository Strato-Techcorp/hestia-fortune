"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";
import LeadForm from "@/components/ui/LeadForm";
import ParallaxImage from "@/components/ui/ParallaxImage";

export default function BrochureCTA() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    const link = document.createElement("a");
    link.href = "/downloads/fortune-hestia-brochure.pdf";
    link.download = "Fortune-Hestia-Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="brochure" className="bg-canvas py-24 md:py-36 border-t border-divider">
      <div className="container-px max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Copy */}
        <div className="lg:col-span-5 lg:col-start-1 order-2 lg:order-1">
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
              <button onClick={() => setOpen(true)} className="btn-primary">
                Download Brochure
              </button>
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink/45">
                PDF &middot; 8 MB
              </span>
            </div>
          </Reveal>
        </div>

        {/* Framed image, mat-board style */}
        <div className="lg:col-span-7 lg:col-start-6 order-1 lg:order-2">
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="bg-surface border border-divider p-3 md:p-4">
                <ParallaxImage
                  src="/images/villa-detail-1.jpg"
                  alt="Fortune Hestia villa architecture"
                  className="aspect-[16/10] w-full"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  intensity={70}
                />
              </div>

              {/* Caption row, beneath the frame like a gallery placard */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  Villa Elevation
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
    </section>
  );
}