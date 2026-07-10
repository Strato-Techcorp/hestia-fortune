"use client";

import { motion } from "framer-motion";

export default function TextReveal({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  wordDelay = 0.06,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  delay?: number;
  wordDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.9,
              delay: delay + i * wordDelay,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
