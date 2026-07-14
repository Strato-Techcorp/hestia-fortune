"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { BLOG_POSTS } from "@/lib/data";

export default function Blogs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="blogs" className="border-t border-divider">
      {/* Dark header band */}
      <div className="bg-ink py-8 md:py-10">
        <div className="container-px max-w-content mx-auto text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-surface/20" />
              <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.14em] text-surface/50">
                Fortune Hestia
              </span>
              <span className="h-px w-6 bg-surface/20" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-3 font-display text-[22px] md:text-[32px] leading-[1.15] tracking-[-1px]">
              <span className="italic font-normal text-surface">Our Latest</span>{" "}
              <span className="font-semibold text-accent">Insights &amp; News</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-2 text-xs md:text-sm text-surface/60 leading-[1.6] max-w-sm mx-auto">
              Architecture, lifestyle, and design philosophy.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Card grid */}
      <div className="bg-canvas py-14 md:py-20">
        <div className="container-px max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.1}>
                <button onClick={() => setOpen(i)} className="text-left w-full group">
                  <ParallaxImage
                    src={post.image}
                    alt={post.title}
                    className="aspect-[4/3]"
                    imageClassName="object-[50%_30%] transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    intensity={50}
                  />
                  <p className="mt-5 label-text text-accent-hover">{post.readTime} read</p>
                  <h3 className="mt-2 font-display font-semibold text-xl text-ink leading-snug group-hover:text-accent-hover transition-colors">
                    {post.card}
                  </h3>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} maxWidth="max-w-2xl">
        {open !== null && (
          <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
            <div className="relative aspect-[16/9]">
              <Image
                src={BLOG_POSTS[open].image}
                alt={BLOG_POSTS[open].title}
                fill
                className="object-cover object-[50%_30%]"
                sizes="90vw"
              />
            </div>
            <div className="p-6 md:p-10">
              <p className="label-text text-accent-hover">{BLOG_POSTS[open].readTime} read</p>
              <h3 className="mt-3 font-display font-semibold text-2xl md:text-3xl text-ink leading-snug">{BLOG_POSTS[open].title}</h3>
              <div className="mt-6 space-y-4">
                {BLOG_POSTS[open].body.map((p, i) => (
                  <p key={i} className="text-muted leading-[1.65]">{p}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}