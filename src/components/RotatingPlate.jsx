import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A plate that crossfades between photographs on a slow timer.
 *
 * Three rules keep it from being a nuisance rather than a detail:
 *
 * - Reduced motion stops it dead. A slideshow is exactly the kind of unsolicited
 *   movement the setting exists to suppress, so the first frame stays put.
 * - The timer only runs while the plate is on screen. An off-screen interval
 *   that keeps swapping `opacity` is work for no one.
 * - Only the first frame carries alt text. A rotating plate should describe
 *   itself once, not re-announce itself every ten seconds.
 *
 * Frames are supplied as responsive descriptors rather than plain paths,
 * because the two frames are not the same width: the counter is a 3429px
 * original and the spice drawer is a 540px crop that needs the sharper
 * derivative on a large screen.
 *
 * The frames are absolutely positioned against the plate (which is already
 * position:relative), so each one covers exactly the same box and crossfades
 * over the others. Leaving them in normal flow instead stacks them vertically
 * inside the fixed-ratio frame, where the second frame is simply clipped away
 * by overflow-hidden and the plate never appears to rotate.
 */
const RotatingPlate = ({
  frames,
  alt,
  ratio = "aspect-[3/4]",
  interval = 10000,
  fade = 1000,
  className = "",
}) => {
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const hostRef = useRef(null);
  const list = frames.filter(Boolean);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still || !inView || list.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, interval);
    return () => clearInterval(timer);
  }, [still, inView, interval, list.length]);

  return (
    <div className={`plate ${ratio} ${className}`} ref={hostRef} data-testid="rotating-plate">
      {list.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          srcSet={frame.srcSet}
          sizes={frame.sizes}
          alt={i === 0 ? alt : ""}
          aria-hidden={i === 0 ? undefined : true}
          loading="lazy"
          decoding="async"
          /* both frames cover the same box — this is what makes them crossfade
             instead of stacking */
          className={`absolute inset-0 h-full w-full object-cover ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: `opacity ${fade}ms linear` }}
        />
      ))}
    </div>
  );
};

export default RotatingPlate;