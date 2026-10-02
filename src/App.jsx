import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import { createLenis, destroyLenis, getLenis, setLenis } from "@/lib/smoothScroll";

/**
 * Every route but Home is split out of the initial bundle. Home is the landing
 * page and is always needed, so it ships eagerly; the other six are only
 * fetched if the visitor actually navigates there. On a phone that is the
 * difference between downloading the whole site up front and downloading the
 * page you asked for.
 */
const Explore = lazy(() => import("@/pages/Explore"));
const Menu = lazy(() => import("@/pages/Menu"));
const DishStory = lazy(() => import("@/pages/DishStory"));
const KathaAI = lazy(() => import("@/pages/KathaAI"));
const OurStory = lazy(() => import("@/pages/OurStory"));
const Visit = lazy(() => import("@/pages/Visit"));

/**
 * The gap between chunks. Deliberately almost nothing: the ledger aesthetic
 * has no spinner in it, and a page that appears instantly reads better than
 * one that flashes a loading state. The real work is text and photographs,
 * which arrive faster than the boundary.
 */
const RouteFallback = () => (
  <div className="mx-auto max-w-[86rem] gutter py-16" aria-busy="true">
    <p className="sr-only" role="status">
      Loading…
    </p>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Through Lenis when it is running, so the jump is not fought by the RAF
    // loop and the page never lands halfway down the next route.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * The deployment base. "/" in dev, "/katha-ceylon/" when a project Pages build
 * is served from a subpath. React Router wants no trailing slash, hence the
 * strip - without the basename every route would resolve against the domain
 * root and 404 on a hard refresh.
 */
const BASENAME = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "");

function App() {
  useEffect(() => {
    const lenis = createLenis();
    if (!lenis) return;
    const release = setLenis(lenis);
    return () => {
      release();
      destroyLenis(lenis);
    };
  }, []);

  return (
    <BrowserRouter basename={BASENAME}>
      {/* min-h svh + flex so a short page still parks the footer at the bottom
          of the screen instead of mid-page. dvh would resize under the URL
          bar; svh is stable and never overflows. */}
      <div className="flex min-h-[100svh] flex-col">
        <ScrollToTop />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/dish/:slug" element={<DishStory />} />
              <Route path="/katha-ai" element={<KathaAI />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/visit" element={<Visit />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {/* Styled from tokens rather than a hardcoded drifted gold. The offset
            is the home-indicator inset: a fixed bottom toast sits under the
            gesture bar on a phone without it. */}
        <Toaster
          position="bottom-right"
          closeButton
          richColors={false}
          offset="calc(1.25rem + env(safe-area-inset-bottom, 0px))"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;