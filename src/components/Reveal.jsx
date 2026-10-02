import { motion, useReducedMotion } from "framer-motion";

/**
 * Motion budget for the whole site.
 *
 * The old design ran a fade-and-slide-up on 36 separate elements, which is the
 * single most reliable "generated page" tell. Content on a ledger simply
 * exists — it does not perform an entrance. The only orchestrated moment is the
 * masthead on Home, which composes <MaskedLine>, <RuleDraw> and <PlateIn>
 * directly.
 *
 * What remains here is reserved for state changes a person caused: region
 * switches, chat replies, the mobile sheet. Those animate because they show
 * something that just happened.
 */
export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 0, className = "" }) => {
  const still = useReducedMotion();
  if (still || y === 0) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/** A headline line that rises out of its own overflow mask. Masthead only. */
export const MaskedLine = ({ children, delay = 0, className = "" }) => {
  const still = useReducedMotion();
  if (still) return <span className={`block ${className}`}>{children}</span>;
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "108%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
};

/** A hairline that draws itself across. Masthead only. */
export const RuleDraw = ({ delay = 0, className = "", tone = "bg-ink" }) => {
  const still = useReducedMotion();
  if (still) return <div className={`h-px w-full origin-left ${tone} ${className}`} />;
  return (
    <motion.div
      className={`h-px w-full origin-left ${tone} ${className}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    />
  );
};

/** A photograph that reveals from the bottom edge. Masthead only. */
export const PlateIn = ({ children, delay = 0, className = "" }) => {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};