import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu as MenuIcon, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";
import { lockScroll } from "@/lib/smoothScroll";

const LINKS = [
  { to: "/explore", label: "Chapters" },
  { to: "/menu", label: "Menu" },
  { to: "/katha-ai", label: "Kathā AI" },
  { to: "/our-story", label: "Our Story" },
  { to: "/visit", label: "Visit" },
];

/**
 * Theme is owned by next-themes, which is what writes the class and the stored
 * preference. The old toggle wrote the same two things by hand and raced it on
 * every OS change — so this only asks next-themes to switch, and reads the
 * resolved value back for the icon and the label.
 */
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Day" : "Night"}
      data-testid="theme-toggle"
      className="grid h-11 w-11 shrink-0 place-items-center border border-rule text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:bg-stock"
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const still = useReducedMotion();
  const toggleRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  // A drawer that leaves the page behind it scrollable is not a drawer. The
  // lock goes on the root (that is what scrolls here) and Lenis is stopped, or
  // the RAF loop keeps scrolling the page the drawer is covering.
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  // Escape closes, and focus goes back to the control that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Keep focus inside the sheet: a tab that walks off into the page behind
      // a modal leaves a screen reader user stranded.
      const focusables = sheetRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-md"
      data-testid="site-header"
    >
      {/* viewport-fit=cover puts the notch over the page, so the sticky header
          has to give the status bar its height back before the bar starts. */}
      <div aria-hidden="true" style={{ height: "env(safe-area-inset-top, 0px)" }} />
      <div className="gutter mx-auto flex h-16 max-w-[86rem] items-center justify-between gap-4 sm:gap-6 lg:h-20">
        <Link to="/" data-testid="nav-home-link" className="shrink-0" aria-label="Kathā Ceylon, home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" data-testid="nav-desktop">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.to.slice(1)}`}
              className={({ isActive }) => `wipe ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/menu"
            data-testid="nav-discover-cta"
            className="hidden min-h-11 items-center border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-paper active:bg-ink active:text-paper sm:inline-flex lg:hidden xl:inline-flex"
          >
            The Menu
          </Link>
          <button
            ref={toggleRef}
            className="grid h-11 w-11 shrink-0 place-items-center text-ink transition-colors duration-200 active:bg-stock lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-mobile-sheet"
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={20} aria-hidden="true" /> : <MenuIcon size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            ref={sheetRef}
            id="nav-mobile-sheet"
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={still ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-contain mobile-menu overflow-y-auto border-t border-rule bg-paper lg:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="gutter mx-auto max-w-[86rem] py-3">
              {LINKS.map((l, i) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  data-testid={`nav-mobile-link-${l.to.slice(1)}`}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center gap-4 border-b border-rule ${
                      isActive ? "text-ink" : "text-ink-soft"
                    }`
                  }
                >
                  <span className="field tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-2xl">{l.label}</span>
                </NavLink>
              ))}
              <Link
                to="/menu"
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-discover-cta"
                className="mt-5 flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-5 py-3.5 text-sm font-medium text-paper transition-colors duration-200 active:bg-ink"
              >
                See the menu
              </Link>
              {/* Clears the home indicator; the drawer is edge to edge. */}
              <div className="safe-bottom" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;