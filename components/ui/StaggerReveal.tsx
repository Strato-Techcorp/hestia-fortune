"use client";

import { motion, Variants } from "framer-motion";

const EASE_LUXE = [0.16, 1, 0.3, 1] as const; // slow, decisive ease-out -- no bounce

const containerVariants = (staggerDelay: number, delayChildren: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_LUXE },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Delay (seconds) between each child's animation start */
  staggerDelay?: number;
  /** Delay (seconds) before the first child starts */
  delayChildren?: number;
  /** Replay every time it scrolls into view, instead of just once */
  once?: boolean;
  /** Fraction of the container that must be visible to trigger */
  amount?: number;
}

/**
 * Wrap a grid/flex of items in this. Each direct child should be a
 * <StaggerItem>. Items drop down from above, one after another in DOM
 * order (left-to-right, then row-by-row in a grid), as the container
 * scrolls into view.
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
  delayChildren = 0,
  once = true,
  amount = 0.3,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants(staggerDelay, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** Override the default drop-in with a custom variant */
  variants?: Variants;
}

/** A single animated child of <StaggerContainer>. */
export function StaggerItem({ children, className, variants }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants ?? itemVariants}>
      {children}
    </motion.div>
  );
}

// Exported so other sections can build custom item variants that still
// share the same easing curve as the rest of the site.
export { EASE_LUXE, itemVariants as defaultStaggerItemVariants };