"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Total px range the image can shift while scrolling through the container */
  intensity?: number;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  intensity = 100,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const range = prefersReducedMotion ? 0 : intensity / 2;
  const rawY = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.5 });

  // Only default to `relative` if the caller hasn't specified their own position utility
  const hasPositionClass = /\b(relative|absolute|fixed|sticky)\b/.test(className);
  const positionClass = hasPositionClass ? "" : "relative";

  return (
    <div
      ref={containerRef}
      className={`${positionClass} overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          y,
          top: `-${intensity / 2}px`,
          height: `calc(100% + ${intensity}px)`,
        }}
        className="absolute inset-x-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
        />
      </motion.div>
    </div>
  );
}