"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-ink/40 backdrop-blur-md border-b border-white/10 ${
          scrolled ? "py-4" : "py-7"
        }`}
      >
        <div className="container-px max-w-content mx-auto flex items-center justify-between">
          <Link href="/" className="relative flex items-center h-16 w-52 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Fortune Hestia"
              fill
              className="object-contain object-left"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-text text-white/90 hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#enquiry"
            className="hidden lg:inline-flex btn-secondary !border-white !text-white hover:!bg-white hover:!text-ink transition-colors duration-500"
          >
            Book a Visit
          </Link>

          <button
            aria-label="Toggle menu"
            className="lg:hidden text-white transition-colors duration-300"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-canvas flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-ink hover:text-accent-hover transition-colors"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * NAV_LINKS.length }}
            >
              <Link href="/#enquiry" onClick={() => setOpen(false)} className="mt-4 btn-secondary">
                Book a Visit
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}