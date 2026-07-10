"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  as,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: "a" | "button";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.35, y: y * 0.45 });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const Tag = as === "a" ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={onClick}
        className={clsx("group", className)}
      >
        <motion.span
          animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="inline-flex items-center gap-2"
        >
          {children}
        </motion.span>
      </Tag>
    </motion.div>
  );
}
