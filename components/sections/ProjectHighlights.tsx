"use client";

import { motion } from "framer-motion";
import {
  Award,
  Navigation,
  Expand,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";
const EASE_BENTO = [0.22, 1, 0.36, 1] as const;

const ACCESS_ROWS = [
  { label: "24×7 security", status: "Active" },
  { label: "Controlled Entry & Exit", status: "Active" },
  { label: "Landscaped Internal Roads", status: "Active" },
];

const NETWORK_NODES = [
  { label: "Clubhouse", className: "top-[6%] left-[2%]" },
  { label: "Swimming Pool", className: "top-[60%] right-0" },
  { label: "Fitness Centre", className: "top-0 right-[6%]" },
  { label: "Landscaped Gardens", className: "bottom-[2%] left-[4%]" },
];

const STAT_ROWS = [
  { label: "Plot Area", fill: 68, value: "21.78 Lakh sq ft" },
  { label: "Open Space", fill: 50, value: "Up to 50%" },
  { label: "Villas", fill: 20, value: "limited" },
];

const PILLS = [
  { label: "PRE-RERA APPROVED", icon: Award },
  { label: "Excellent Connectivity", icon: Navigation },
  { label: "Up to 50% Open Spaces", icon: Expand },
  { label: "BMRDA Approved", icon: Landmark },
  { label: "Premium Construction", icon: ShieldCheck },
];

/** Opacity-only hover shadow layer — avoids animating box-shadow directly,
 *  which forces paint on every frame and is the main cause of hover jank. */
function HoverShadow() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE_BENTO }}
      className="pointer-events-none absolute inset-0"
      style={{ boxShadow: "0 24px 60px rgba(26,26,26,0.12)", willChange: "opacity" }}
    />
  );
}

export default function ProjectHighlights() {
  return (
    <section
      id="highlights"
      className="py-24 md:py-28 lg:py-[120px] overflow-hidden"
      style={{ backgroundColor: "#F9F7F3", color: "#1A1A1A" }}
    >
      <div className="container-px max-w-content mx-auto">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-10 mb-14">
          <Reveal>
            <div>
              <span
                className="block text-xs font-medium uppercase tracking-[3px] mb-4"
                style={{ color: "#A8A8A8" }}
              >
                Project Highlights
              </span>
              <h2
                className="font-display font-semibold leading-[1.1] max-w-[640px]"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                Why This Project is Exceptional
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="max-w-[340px] text-sm font-light leading-[1.7]"
              style={{ color: "#7A7A7A" }}
            >
              Four limited-edition villas, engineered for privacy, community, and lasting value.
            </p>
          </Reveal>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 — Gated Community Living */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0, ease: EASE_BENTO }}
            whileHover={{ y: -4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative sm:col-start-1 sm:row-start-1 lg:col-start-1 lg:row-start-1 p-8 flex flex-col"
          >
            <HoverShadow />
            <div
              className="absolute inset-0 -z-10"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E9E3DA" }}
            />
            <div className="font-display font-semibold text-2xl leading-tight mb-2.5">
              Private Gated Community
            </div>
            <p className="text-[13.5px] font-light leading-[1.6] mb-5.5" style={{ color: "#7A7A7A" }}>
              Experience secure, peaceful living within a thoughtfully planned gated community in Sarjapur Road, designed for privacy, greenery and everyday comfort.

            </p>
            <div
              className="mt-auto p-4"
              style={{ backgroundColor: "#F9F7F3", border: "1px solid #E9E3DA" }}
            >
              {ACCESS_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-2 text-xs ${i !== ACCESS_ROWS.length - 1 ? "border-b" : ""
                    }`}
                  style={i !== ACCESS_ROWS.length - 1 ? { borderColor: "#E9E3DA" } : undefined}
                >
                  <span>{row.label}</span>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.5px]"
                    style={{ color: "#C8A46B" }}
                  >
                    <span className="w-1.5 h-1.5" style={{ backgroundColor: "#C8A46B" }} />
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2 — Exclusive Amenities (dark) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE_BENTO }}
            whileHover={{ y: -4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative sm:col-start-2 sm:row-start-1 lg:col-start-2 lg:row-start-1 p-8 flex flex-col text-[#F3EFE4]"
          >
            <HoverShadow />
            <div
              className="absolute inset-0 -z-10"
              style={{ background: "radial-gradient(circle at 30% 20%, #2A2415 0%, #17140F 60%)" }}
            />
            <div className="font-display font-semibold text-2xl leading-tight mb-2.5 text-white">
              Curated Lifestyle Amenities
            </div>
            <p className="text-[13.5px] font-light leading-[1.6] mb-5 text-white/55">
              Thoughtfully curated amenities for wellness, recreation and family living.
            </p>
            <div className="relative flex-1 min-h-[120px] mt-auto">
              <svg viewBox="0 0 300 140" className="w-full h-full">
                <line x1="150" y1="70" x2="50" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="150" y1="70" x2="250" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="150" y1="70" x2="230" y2="25" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="150" y1="70" x2="60" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <circle cx="150" cy="70" r="5" fill="#C8A46B" />
              </svg>
              {/* backdrop-blur removed -- solid translucent bg is visually close
                  and costs nothing per scroll frame */}
              {NETWORK_NODES.map((node) => (
                <div
                  key={node.label}
                  className={`absolute flex items-center gap-1.5 whitespace-nowrap py-[5px] pl-[5px] pr-2.5 text-[10px] text-[#F3EFE4] ${node.className}`}
                  style={{ backgroundColor: "rgba(30,26,18,0.55)", border: "1px solid rgba(255,255,255,0.14)" }}
                >
                  <span
                    className="w-[18px] h-[18px] shrink-0"
                    style={{ background: "linear-gradient(135deg, #C8A46B, #8A6A3E)" }}
                  />
                  {node.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3 — Space, By Design (wide CTA) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EASE_BENTO }}
            whileHover={{ y: -4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative sm:col-span-2 sm:row-start-2 lg:col-start-1 lg:col-span-2 lg:row-start-2 p-8 flex flex-col md:flex-row items-center gap-8"
          >
            <HoverShadow />
            <div
              className="absolute inset-0 -z-10"
              style={{ background: "linear-gradient(120deg, #F6E8D2 0%, #EFC9A6 45%, #C8A46B 100%)" }}
            />
            <div className="flex-1 min-w-[220px]">
              <div className="font-display font-semibold text-[28px] leading-tight mb-2.5">
                Space, Designed Around Life
              </div>
              <p className="text-[13.5px] font-light leading-[1.6] mb-5 max-w-[340px]" style={{ color: "#3C3226" }}>
                Enjoy expansive layouts, landscaped gardens and naturally lit interiors that redefine luxury living in Fortune Hestia.
              </p>
              <Link
                href="/villas#villas"
                className="inline-flex items-center gap-2 px-[22px] py-3 text-xs font-medium tracking-[0.5px] text-white transition-colors duration-300 hover:bg-black"
                style={{ backgroundColor: "#1A1A1A", willChange: "background-color" }}
              >
                Explore Luxury Villas
              </Link>
            </div>
            {/* backdrop-blur removed here too -- solid translucent bg, same look, no per-frame cost */}
            <div
              className="flex-1 min-w-[220px] w-full p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.7)" }}
            >
              {STAT_ROWS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2.5 mb-3 last:mb-0">
                  <span className="text-[11px] w-[78px] shrink-0" style={{ color: "#4A4030" }}>
                    {s.label}
                  </span>
                  <div className="flex-1 h-2 overflow-hidden bg-black/[0.08]">
                    <motion.div
                      className="h-full w-full origin-left"
                      style={{ backgroundColor: "#1A1A1A", willChange: "transform" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: s.fill / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: EASE_BENTO }}
                    />
                  </div>
                  <span className="text-[9px] w-[50px] text-right shrink-0" style={{ color: "#4A4030" }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4 — 4 BHK Limited Edition Villas (tall hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EASE_BENTO }}
            whileHover={{ y: -4 }}
            style={{ willChange: "transform, opacity" }}
            className="relative sm:col-span-2 sm:row-start-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 p-7 flex flex-col"
          >
            <HoverShadow />
            <div className="absolute inset-0 -z-10" style={{ backgroundColor: "#EFEAE0" }} />
            <span
              className="self-center inline-flex px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.85)", border: "1px solid rgba(26,26,26,0.08)" }}
            >
              PRE-RERA APPROVED
            </span>
            <div className="font-display font-semibold text-2xl leading-tight text-center mb-2.5">
              Limited Edition 4 BHK Luxury Villas
            </div>
            <p className="text-[13.5px] font-light leading-[1.6] text-center mb-5" style={{ color: "#7A7A7A" }}>
              Discover Greek-inspired luxury villas off Sarjapur Road, thoughtfully crafted for refined family living.
            </p>
            <div className="relative flex-1 overflow-hidden min-h-[260px]">
              <Image
                src="/images/Project.jpg"
                alt="Fortune Hestia villa project"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />

              <div
                className="absolute top-[18%] left-[10%] px-3 py-[7px] text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 6px 16px rgba(26,26,26,0.15)" }}
              >
                Prime Sarjapur Road Location
              </div>
              <div
                className="absolute top-[38%] right-[12%] px-3 py-[7px] text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 6px 16px rgba(26,26,26,0.15)" }}
              >
                Premium Gated Community
              </div>
              <div
                className="absolute bottom-[14%] left-[26%] px-3.5 py-[9px] text-[13px] font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 6px 16px rgba(26,26,26,0.15)" }}
              >
                Your New Home Awaits…
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature pills -- 2-column grid on mobile (fewer rows, less scrolling),
            stretching to the bento grid's full width in an even row on sm+.
            Last pill (odd one out of 5) spans both mobile columns. */}
        <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-row w-full gap-3">
          {PILLS.map((pill, i) => {
            const Icon = pill.icon;
            const isLast = i === PILLS.length - 1;
            return (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: EASE_BENTO }}
                className={`group relative flex items-center justify-center gap-2 sm:gap-2.5 w-full sm:flex-1 px-3 sm:px-[22px] py-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.5px] sm:tracking-[1px] bg-white/85 hover:bg-white transition-colors duration-300 ${isLast ? "col-span-2 sm:col-span-1" : ""
                  }`}
                style={{ border: "1px solid #E9E3DA", willChange: "transform, opacity" }}
              >
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: EASE_BENTO }}
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: "0 8px 24px rgba(200,164,107,0.25)", willChange: "opacity" }}
                />
                <Icon
                  size={16}
                  strokeWidth={1.6}
                  className="relative shrink-0 transition-transform duration-300 group-hover:rotate-12"
                  style={{ color: "#C8A46B" }}
                />
                <span className="relative">{pill.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}