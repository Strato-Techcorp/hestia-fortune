"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { LOCATION_HIGHLIGHTS } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import LeadForm from "@/components/ui/LeadForm";

const sarjapur = {
  coords: [77.7512, 12.8615],
};

export default function EverythingWithinReach() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: sarjapur.coords as [number, number],
      zoom: 10.5,
      pitch: 55,
      bearing: -18,
    });

    // Marker — uses the site's accent color token value directly (inline
    // style required since MapLibre markers render outside Tailwind's scope)
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
        <div style="
          width:10px;height:10px;
          background:#B8EB86;
          border-radius:999px;
          box-shadow:0 0 28px rgba(184,235,134,0.55);
        "></div>
        <span style="
          font-family:inherit;
          font-size:9px;
          letter-spacing:0.3em;
          color:rgba(255,255,255,0.4);
          text-transform:uppercase;
        ">Sarjapur</span>
      </div>
    `;

    new maplibregl.Marker(el)
      .setLngLat(sarjapur.coords as [number, number])
      .addTo(map.current);

    setTimeout(() => {
      map.current?.flyTo({
        center: sarjapur.coords as [number, number],
        zoom: 12.6,
        speed: 0.9,
        curve: 1.6,
        essential: true,
      });
    }, 900);

    return () => map.current?.remove();
  }, []);

  return (
    <section id="location" ref={sectionRef} className="border-t border-divider">
      {/* Dark header band with interactive map */}
      <div className="bg-ink py-20 md:py-28 lg:py-32">
        <div className="container-px max-w-content mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left text */}
            <div>
              <div className="overflow-hidden mb-6">
                <div
                  className={`flex items-center gap-3 transition-all duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="label-text !tracking-[0.14em] text-surface/50">Location</span>
                  <span className="h-px w-8 bg-accent" />
                  <span className="label-text !tracking-[0.14em] text-accent">Sarjapur Road</span>
                </div>
              </div>

              <div className="overflow-hidden">
                <h2
                  className={`font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] tracking-[-1.5px] transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  <span className="italic font-normal text-surface">Everything Within</span>
                  <br />
                  <span className="font-semibold text-accent">Reach</span>
                </h2>
              </div>

              <div className="overflow-hidden mt-6">
                <p
                  className={`text-sm md:text-base text-surface/60 leading-[1.65] max-w-md transition-all duration-[1400ms] delay-200 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                    visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  Thoughtfully located off Sarjapur Road, with seamless access to
                  Bengaluru&apos;s IT hubs, schools and daily conveniences.
                </p>
              </div>

              <div className="overflow-hidden">
                <span
                  className={`mt-10 block h-px w-16 bg-surface/20 transition-all duration-[1600ms] delay-300 ${
                    visible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}
                />
              </div>
            </div>

            {/* Right — interactive map */}
            <div
              ref={mapContainer}
              data-lenis-prevent
              className={`h-[380px] md:h-[480px] lg:h-[520px] overflow-hidden  shadow-[0_0_120px_rgba(184,235,134,0.05)] transition-all duration-[1600ms] ease-out ${
                visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}