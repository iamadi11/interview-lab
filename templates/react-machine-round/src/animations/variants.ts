/**
 * Framer Motion variants — reusable animation presets for interview demos.
 * Import and spread directly onto <motion.div variants={fadeUp} />
 */
import type { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.175, 0.885, 0.32, 1.275] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

/** Stagger children animations — apply to parent container. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/** Card hover lift — apply with whileHover. */
export const cardHover = {
  whileHover: { y: -4, scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
};

/** Modal backdrop + panel. */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.15 } },
};

/** Toast notification. */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 32, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, x: 32, scale: 0.95, transition: { duration: 0.2 } },
};
