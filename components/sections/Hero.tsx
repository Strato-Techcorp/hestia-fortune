"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import LeadForm from "@/components/ui/LeadForm";

export default function Hero() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowForm(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative w-full min-h-[100svh] flex items-end overflow-hidden">
      {/* Full-bleed background image -- this stays edge-to-edge, correctly */}
      <div className="absolute inset-0">
        <Image
          src="/images/villa-detail-2.jpg"
          alt="Fortune Hestia villa elevation, Sarjapur Road, Bangalore"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/45 to-ink/10" />
      </div>

      {/* Content -- now aligned to the same container as every other section */}
      <div className="relative z-10 w-full container-px max-w-content mx-auto pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7">
            <Reveal direction="up">
              <span className="eyebrow text-accent">Fortune Hestia</span>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h1 className="mt-4 sm:mt-5 font-display text-surface text-hero-sm md:text-hero-md lg:text-hero leading-[1.1]">
                Luxury Villas in <span className="text-accent">Sarjapur Road</span> Bangalore
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.2}>
              <p className="mt-6 sm:mt-6 max-w-md text-sm sm:text-base leading-[1.65] text-surface/75">
                Thoughtfully crafted homes that bring together contemporary
                living, open spaces, and seamless connectivity in Bengaluru&rsquo;s
                thriving IT corridor.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <a
                href="#enquiry"
                className="mt-8 sm:mt-8 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-surface text-surface text-label uppercase font-sans font-semibold transition-colors duration-300 hover:bg-surface hover:text-ink"
              >
                Book a Private Tour
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-5 mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={
                showForm
                  ? {
                      opacity: 1,
                      y: [0, -8, 0],
                      scale: [1, 1.015, 1],
                    }
                  : {}
              }
              transition={
                showForm
                  ? {
                      opacity: { duration: 1, ease: [0.65, 0, 0.35, 1] },
                      y: {
                        duration: 6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1,
                      },
                      scale: {
                        duration: 6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1,
                      },
                    }
                  : { duration: 1, ease: [0.65, 0, 0.35, 1] }
              }
              className="hero-lead-form w-full max-w-md lg:max-w-none lg:ml-auto rounded-2xl bg-surface/5 backdrop-blur-xl border border-surface/15 shadow-[0_8px_60px_rgba(0,0,0,0.25)] p-1"
            >
              <LeadForm
                dark
                title="Enquire Now"
                subtitle="Share your details and our team will call you back."
                submitLabel="Schedule a Site Visit"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Force any solid background utility classes inside LeadForm to transparent,
          since we don't control LeadForm's internal markup from here. */}
      <style jsx global>{`
        .hero-lead-form,
        .hero-lead-form > * {
          background-color: transparent !important;
        }
      `}</style>
    </section>
  );
}