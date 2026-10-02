import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getRegionDetail, getRegions, paragraphs } from "@/lib/api";
import { regionInk, REGION_BY_ID } from "@/content/regions";
import { ISLAND_MARKERS, ISLAND_PATH, ISLAND_VIEWBOX } from "@/content/island";
import ChapterPlate from "@/components/ChapterPlate";
import DishCard from "@/components/DishCard";
import { regionImage } from "@/lib/images";

/* ------------------------------------------------------------------- the island */

/**
 * A map of the island, not a drawing of one: the outline is traced from real
 * geography and the four markers sit at the real position of each region's
 * city. The fill is a tea tint rather than solid tea, because solid tea is
 * Nuwara Eliya's own region colour and the marker would vanish into it.
 *
 * Every dot wears a paper-coloured halo. That is not only contrast — Colombo
 * and Galle are coastal cities and sit right on the coastline, so the halo
 * doubles as the gap that keeps a marker from bleeding into the land.
 *
 * The hit circle is 15 units across, which is ~50px at the size the map is
 * drawn on a phone: a 3-unit dot is not a thing a finger can land on. Keyboard
 * focus gets a real ring rather than the old opacity change, because fading a
 * marker tells a sighted keyboard user nothing about where they are.
 */
const IslandMap = ({ active, onSelect }) => (
  <svg
    viewBox={ISLAND_VIEWBOX}
    className="mx-auto h-auto w-full max-w-[22rem] lg:max-w-none"
    role="group"
    aria-label="Map of Sri Lanka with the four regions marked"
    data-debug-wrapper="true"
  >
    <path
      d={ISLAND_PATH}
      className="fill-tea/15 stroke-rule"
      strokeWidth="0.5"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />

    {ISLAND_MARKERS.map((m) => {
      const on = active === m.id;
      return (
        <g
          key={m.id}
          onClick={() => onSelect(m.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(m.id);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={REGION_BY_ID[m.id]?.name}
          aria-pressed={on}
          className="group cursor-pointer"
        >
          <circle cx={m.x} cy={m.y} r="7.5" className="fill-transparent" />
          <circle
            cx={m.x}
            cy={m.y}
            r="6"
            className="fill-none stroke-brass opacity-0 transition-opacity duration-150 group-focus-visible:opacity-100"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={m.x} cy={m.y} r={on ? 4.4 : 3.4} className="fill-paper" />
          <circle
            cx={m.x}
            cy={m.y}
            r={on ? 2.3 : 1.8}
            className={`${regionInk(m.id).text} transition-all duration-200`}
          />
          {on && (
            <circle
              cx={m.x}
              cy={m.y}
              r="4.9"
              className={`fill-none ${regionInk(m.id).text}`}
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      );
    })}
  </svg>
);

/* ---------------------------------------------------------------------- the page */

const Explore = () => {
  const [params, setParams] = useSearchParams();
  const [regions, setRegions] = useState([]);
  const [detail, setDetail] = useState(null);
  const still = useReducedMotion();

  const active = params.get("region") ?? "nuwara-eliya";

  useEffect(() => {
    getRegions().then(setRegions).catch(() => {});
  }, []);

  useEffect(() => {
    setDetail(null);
    getRegionDetail(active).then(setDetail).catch(() => {});
  }, [active]);

  const select = (id) => {
    const next = new URLSearchParams(params);
    next.set("region", id);
    setParams(next, { replace: true });
  };

  return (
    <div data-testid="explore-page">
      {/* ------------------------------------------------------------- head bar */}
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <span className="field">The four chapters</span>
            <span className="field">Select a region</span>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-8 py-12 lg:grid-cols-12">
            <h1 className="display text-[2.75rem] leading-[1] sm:text-5xl lg:col-span-7">
              The island, chapter by chapter.
            </h1>
            <p className="copy max-w-[42ch] self-end text-[0.9375rem] text-ink-soft lg:col-span-5">
              Each region carries its own ingredients, its own history and its own
              handful of dishes. Read them in order, or jump to the one you want.
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- map + chapter switch */}
      <section className="border-b border-rule bg-stock">
        <div className="mx-auto max-w-[86rem] gutter py-12">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="field mb-6 text-center lg:text-left">Position</p>
              <IslandMap active={active} onSelect={select} />
              <p className="field mt-5 text-center">Bounded by the Indian Ocean</p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="field mb-6">Chapters</p>
              <div className="border-t border-rule" data-testid="region-tabs">
                {regions.map((r, i) => {
                  const ink = regionInk(r.id);
                  const on = active === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => select(r.id)}
                      data-testid={`region-tab-${r.id}`}
                      aria-current={on ? "true" : undefined}
                      className={`grid w-full grid-cols-[auto_1fr] items-baseline gap-x-5 border-b border-rule py-4 text-left transition-colors duration-200 active:bg-paper sm:grid-cols-[auto_1fr_auto] ${
                        on ? "bg-paper" : "hover:bg-paper/60"
                      }`}
                    >
                      <span className={`field tnum ${on ? ink.text : ""}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`display min-w-0 text-xl sm:text-2xl ${
                          on ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {r.name}
                      </span>
                      <span className="field col-span-2 mt-1 text-ink-soft sm:col-span-1 sm:mt-0 sm:text-right">
                        {r.epithet}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- the chapter */}
      {!detail ? (
        /* The region arrives async, so the page holds the shape of the chapter
           it is about to show. Without this the whole column is absent for a
           frame and the content jumps down under the visitor's thumb. */
        <section className="border-b border-rule" aria-busy="true" data-testid="region-loading">
          <div className="mx-auto max-w-[86rem] gutter py-12 lg:py-16">
            {/* mirrors the real chapter: portrait media beside copy, so nothing
                jumps when the region resolves */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div
                  className="plate aspect-[9/16] max-h-[70svh] lg:max-h-none"
                  aria-hidden="true"
                />
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <div className="h-10 w-3/4 bg-stock" aria-hidden="true" />
                <div className="mt-4 h-3 w-32 bg-stock" aria-hidden="true" />
                <div className="mt-10 space-y-3">
                  <div className="h-3 w-40 bg-stock" aria-hidden="true" />
                  <div className="h-8 w-full max-w-lg bg-stock" aria-hidden="true" />
                  <div className="h-3 w-full bg-stock" aria-hidden="true" />
                  <div className="h-3 w-11/12 bg-stock" aria-hidden="true" />
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm text-ink-soft" role="status">
              Opening the chapter…
            </p>
          </div>
        </section>
      ) : (
        <div className="border-b border-rule">
          <AnimatePresence mode="wait">
            <motion.section
              key={detail.region.id}
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* The chapter, as a plate beside its story rather than a
                  banner above it. The clips are 9:16 portrait, so a wide
                  frame would keep a 24%-tall sliver of each one and upscale
                  2.9x. No text sits over the media either — the scrim existed
                  to keep a caption legible on a photograph, and moving
                  footage is a worse place to put words than a still is. */}
              <div className="mx-auto max-w-[86rem] gutter py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
                  <figure className="lg:col-span-4">
<ChapterPlate
                      image={regionImage(detail.region.image)}
                      videoSrc={detail.region.video?.src}
                      poster={detail.region.video?.poster}
                      alt={`${detail.region.name} — ${detail.region.epithet.toLowerCase()}`}
                      ratio="aspect-[9/16] max-h-[70svh] lg:max-h-none"
                    />
                    <figcaption className="mt-3 flex flex-col gap-1 hairline pt-2.5">
                      <span className="field">{detail.region.chapter}</span>
                      <span className="copy max-w-[40ch] text-xs text-ink-soft sm:text-[0.8125rem]">
                        {detail.region.tagline}
                      </span>
                    </figcaption>
                  </figure>

                  <div className="lg:col-span-7 lg:col-start-6">
                    <h2 className="display text-3xl leading-none sm:text-4xl lg:text-5xl">
                      {detail.region.name}
                    </h2>
                    <p className="field mt-4">{detail.region.epithet}</p>

                    <div className="mt-8">
                      <p className="field mb-5">{detail.region.storiesTitle}</p>
                      <h3
                        className="display mb-5 text-2xl leading-tight sm:text-3xl"
                        data-testid="region-story-title"
                      >
                        {detail.region.storyTitle}
                      </h3>
                      <div className="prose-ledger" data-testid="region-history">
                        {paragraphs(detail.region.history).map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>

                      {detail.region.pullQuote && (
                        <p className="quotation mt-7 border-l-2 border-brass pl-5 text-xl sm:text-2xl">
                          {detail.region.pullQuote}
                        </p>
                      )}
                    </div>

                    <aside className="mt-12 border-t border-rule pt-8">
                      <p className="field mb-4">Signature ingredients</p>
                      <dl
                        className="grid grid-cols-1 gap-x-10 sm:grid-cols-2"
                        data-testid="region-ingredients"
                      >
                        {detail.region.signatureIngredients.map((ing, i) => (
                          <div
                            key={ing}
                            className="flex items-baseline gap-4 border-t border-rule py-2.5"
                          >
                            <span className="field tnum w-8 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm text-ink">{ing}</span>
                          </div>
                        ))}
                      </dl>

                      <Link to="/menu" className="btn-quiet mt-8 w-full sm:w-auto">
                        See the whole menu
                      </Link>
                    </aside>
                  </div>
                </div>
              </div>

              {/* the chapter's lots */}
              <div className="border-t border-rule">
                <div className="mx-auto max-w-[86rem] gutter py-14">
                  <p className="field mb-10">
                    {detail.dishes.length} lots from {detail.region.name}
                  </p>
                  <div
                    className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                    data-testid="region-dish-list"
                  >
                    {detail.dishes.map((d, i) => (
                      <DishCard key={d.slug} dish={d} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Explore;