import Lenis from "lenis";

/**
 * One smooth-scroll instance for the site, held outside React.
 *
 * The drawer needs to stop the page scrolling while it owns the screen, and
 * the router needs to jump to the top on a route change without fighting the
 * RAF loop. Both used to need a ref threaded through the tree; a module-level
 * handle keeps the instance in one place and lets any component ask for it.
 */
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
  return () => {
    if (instance === lenis) instance = null;
  };
};

export const getLenis = () => instance;

/** Locks or releases the page the way a native sheet does. */
export const lockScroll = (locked) => {
  const root = document.documentElement;
  root.classList.toggle("drawer-open", locked);
  if (locked) instance?.stop();
  else instance?.start();
};

export const createLenis = () => {
  // Smooth-wheel scrolling is a preference, not a default: honour the OS.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

  let frame;
  const raf = (time) => {
    lenis.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);

  // `frame` changes on every tick. Capturing the first request id leaves the
  // recursive loop alive after unmount, so expose a closure over the current id.
  lenis.__cancelRaf = () => cancelAnimationFrame(frame);
  return lenis;
};

export const destroyLenis = (lenis) => {
  lenis?.__cancelRaf?.();
  lenis?.destroy();
};
