import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { MaskedLine, PlateIn, RuleDraw } from "@/components/Reveal";
import DishCard from "@/components/DishCard";
import RotatingPlate from "@/components/RotatingPlate";
import { getDishes, getRegions, siteUrl } from "@/lib/api";
import { regionInk } from "@/content/regions";
import { montageImage, plateImage, spiceImage } from "@/lib/images";

/* Plate I frames all four chapters at once, so it is a montage rather than a
   photograph of one place. hero-tea.jpg was removed once this replaced it. */
const HERO_IMG = montageImage("/img/homepagemain.jpg");
const PATISSERIE_IMG = plateImage("/img/patisserie.jpg");
const SPICES_IMG = spiceImage("/img/spices.jpg");

/* ------------------------------------------------------------------ masthead */

const Masthead = () => (
  <section className="border-b border-rule" data-testid="home-hero">
    <div className="mx-auto max-w-[86rem] gutter">
      <RuleDraw delay={0.05} className="h-px" tone="bg-ink" />

      {/* the running head, set as a ledger's title block */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-3">
        <p className="field">The Estate Ledger</p>
        <p className="field">Four Chapters · Twenty-eight Lots</p>
        <p className="field">Colombo · Sri Lanka</p>
      </div>

      <RuleDraw delay={0.15} className="h-px" tone="bg-ink" />

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 py-12 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <p className="field mb-6" translate="no">Kāṭhā (කථා) — story</p>

          <h1
            className="display text-[3rem] leading-[0.98] sm:text-6xl lg:text-[5.25rem]"
            data-testid="hero-headline"
          >
            <MaskedLine delay={0.3}>Traditional</MaskedLine>
            <MaskedLine delay={0.44} className="italic text-brass">
              flavours.
            </MaskedLine>
            <MaskedLine delay={0.58}>Modern stories.</MaskedLine>
          </h1>

          <p className="copy mt-6 max-w-[42ch] text-[0.9375rem] text-ink-soft sm:text-base">
            A menu that travels through Nuwara Eliya, Kurunegala, Galle and Colombo.
            Every dish is tied to the flavours and heritage of its region — scan the
            code on your table and the story unfolds.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/menu" data-testid="hero-discover-cta" className="btn">
              See the menu
            </Link>
            <Link to="/explore" data-testid="hero-explore-map-cta" className="wipe text-sm text-ink">
              Read the four chapters
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PlateIn delay={0.5}>
            <figure>
              {/* object-contain, not cover: the montage carries its own place
                  names in the corners, and this frame's aspect ratios would
                  crop straight through them. Mounting it whole on the recessed
                  surface reads as a plate in a catalogue rather than a crop. */}
              <div className="plate aspect-[5/4] lg:aspect-[4/5]">
                <img
                  src={HERO_IMG.src}
                  srcSet={HERO_IMG.srcSet}
                  sizes={HERO_IMG.sizes}
                  alt="The four chapters in one frame: Nuwara Eliya's tea country, Kurunegala's Elephant Rock, Galle's fort, and Colombo's skyline at dusk"
                  fetchPriority="high"
                  decoding="async"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1 hairline pt-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="field tnum">Plate I</span>
                <span className="copy max-w-[34ch] text-xs leading-snug text-ink-soft sm:text-[0.8125rem]">
                  Nuwara Eliya · Kurunegala · Galle · Colombo
                </span>
                <span className="field shrink-0">Four Chapters</span>
              </figcaption>
            </figure>
          </PlateIn>
        </div>
      </div>

      <RuleDraw delay={0.75} className="h-px" tone="bg-ink" />
    </div>
  </section>
);

/* ----------------------------------------------------------- chapter register */

/** The four chapters as ruled rows of an index, not a grid of cards. */
const ChapterRegister = ({ regions }) => (
  <section className="border-b border-rule py-20 sm:py-28" data-testid="home-chapters">
    <div className="mx-auto max-w-[86rem] gutter">
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12">
        <div className="md:col-span-1">
          <span className="field tnum">01</span>
        </div>
        <h2 className="display text-3xl leading-[1.05] sm:text-4xl md:col-span-7">
          One island, told in four regions.
        </h2>
        <p className="copy text-sm text-ink-soft md:col-span-4">
          Each chapter is a region, an ingredient set, and a handful of dishes that
          could only have come from there.
        </p>
      </div>

      <div className="mt-14">
        {regions.map((r, i) => {
          const ink = regionInk(r.id);
          return (
            <Link
              key={r.id}
              to={`/explore?region=${r.id}`}
              data-testid={`chapter-card-${r.id}`}
              className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-t border-rule py-6 transition-colors duration-300 hover:bg-stock active:bg-stock sm:grid-cols-12 sm:py-7"
            >
              <span className={`field tnum ${ink.text} sm:col-span-1`}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="display text-2xl leading-tight sm:col-span-3 sm:text-[1.75rem]">
                {r.name}
              </h3>

              <span className="field sm:col-span-2">{r.chapter}</span>

              <p className="copy max-w-[34ch] text-sm text-ink-soft sm:col-span-4">
                {r.tagline}
              </p>

              <span className="field wipe justify-self-start sm:col-span-2 sm:justify-self-end">
                Read
                <span className="sr-only"> {r.name} chapter</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ two kitchens */

const TwoKitchens = () => (
  <section className="border-b border-rule py-20 sm:py-28" data-testid="home-intro">
    <div className="mx-auto max-w-[86rem] gutter">
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <figure>
            {/* the counter, and the spice drawer behind it — crossfading every
                ten seconds, standing still under reduced motion */}
            <RotatingPlate
              frames={[PATISSERIE_IMG, SPICES_IMG]}
              alt="A patisserie counter of glazed éclairs and tarts, and the Ceylon spice drawer beside it — true cinnamon, star anise, nutmeg and cloves"
              ratio="aspect-[3/4]"
              interval={10000}
              fade={1000}
            />
            <figcaption className="mt-3 flex flex-col gap-1 hairline pt-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="field tnum">Plate II</span>
              <span className="copy max-w-[38ch] text-xs leading-snug text-ink-soft sm:text-[0.8125rem]">
                The counter — where French method meets island produce
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="field mb-5">02 — The method</p>
          <h2 className="display text-3xl leading-[1.05] sm:text-4xl">
            French technique.
            <br />
            Ceylonese soul.
          </h2>
          <div className="prose-ledger mt-6">
            <p>
              Kathā Ceylon is a café built like a ledger. Classic French patisserie — the
              éclair, the tart, the bonbon — retold through the flavours of Sri Lanka:
              highland tea, kithul treacle, true cinnamon, king coconut.
            </p>
            <p>
              The menu doesn&rsquo;t follow breakfast, lunch and dessert. It follows the island.
            </p>
          </div>
          <p className="quotation mt-8 max-w-[26ch] border-l-2 border-brass pl-5 text-xl sm:text-2xl">
            A dish is just a story you can taste.
          </p>
          <Link
            to="/our-story"
            data-testid="intro-our-story-link"
            className="wipe mt-7 inline-block text-sm text-ink"
          >
            Read our story
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------- signature lots */

const SignatureLots = ({ featured }) => {
  if (!featured.length) return null;
  return (
    <section className="border-b border-rule py-20 sm:py-28" data-testid="home-featured-dishes">
      <div className="mx-auto max-w-[86rem] gutter">
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-1">
            <span className="field tnum">03</span>
          </div>
          <h2 className="display text-3xl leading-[1.05] sm:text-4xl md:col-span-7">
            Lots that carry the island.
          </h2>
          <div className="flex items-start md:col-span-4 md:justify-end">
            <Link to="/menu" data-testid="featured-view-menu-link" className="wipe text-sm text-ink">
              All twenty-eight lots
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d, i) => (
            <DishCard key={d.slug} dish={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------ ritual */

const Ritual = () => (
  <section className="border-b border-rule bg-band text-on-band" data-testid="home-qr-explainer">
    <div className="gutter mx-auto max-w-[86rem] py-20 sm:py-28">
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="field brass-text-on-band mb-5">04 — The ritual</p>
          <h2 className="display text-3xl leading-[1.05] text-on-band sm:text-4xl">
            Every plate arrives with a story to scan.
          </h2>

          <ol className="mt-12">
            {[
              {
                n: "01",
                t: "Scan the table code",
                d: "Every table carries a single code. Point your camera — no app needed.",
              },
              {
                n: "02",
                t: "Open the ledger",
                d: "Four chapters, every dish, every ingredient it was built from.",
              },
              {
                n: "03",
                t: "Read the story",
                d: "Each lot opens onto its region, its key ingredient, and the history behind it.",
              },
            ].map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-on-band/20 py-6">
                <span className="field tnum brass-text-on-band">{s.n}</span>
                <div>
                  <h3 className="display text-xl leading-tight text-on-band sm:text-2xl">{s.t}</h3>
                  <p className="copy mt-2 max-w-[46ch] text-sm text-on-band/70">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="border border-on-band/25 p-7 sm:p-9" data-testid="table-card-mockup">
            {/* field-on-band, not field: soft ink on the band is 2.1:1 */}
            <p className="field-on-band mb-6">Table card</p>
            <p className="display text-3xl leading-[1.05] text-on-band sm:text-4xl">
              Scan.
              <br />
              Taste.
              <br />
              Read.
            </p>

            <div className="mt-8 flex justify-center" data-testid="home-website-qr">
              {/* kept dark-on-white in both modes: the code has to scan. The
                  white block is therefore always lighter than the band, and
                  .plate's night filter is deliberately not applied to it. */}
              <div
                className="bg-white p-3"
                role="img"
                aria-label="QR code that opens the Kathā Ceylon menu on a phone"
              >
                <QRCodeSVG value={siteUrl()} size={112} fgColor="#14201C" bgColor="#FFFFFF" level="M" />
              </div>
            </div>

            <p className="copy mt-6 text-sm text-on-band/70">
              Scan to open the menu and read the story behind every dish.
            </p>

            <div className="mt-7 border-t border-on-band/25 pt-4">
              <p className="display brass-text-on-band text-xl">Kathā Ceylon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* --------------------------------------------------------------------------- page */

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    getDishes({ featured: true }).then((d) => setFeatured(d.slice(0, 6))).catch(() => {});
    getRegions().then(setRegions).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Masthead />
      <ChapterRegister regions={regions} />
      <TwoKitchens />
      <SignatureLots featured={featured} />
      <Ritual />

      <section className="py-24 sm:py-32" data-testid="home-final-cta">
        <div className="mx-auto max-w-[42rem] gutter">
          <p className="field mb-6">End of ledger</p>
          <p className="quotation text-3xl sm:text-4xl">
            Your table has a story waiting.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/menu" data-testid="final-discover-cta" className="btn">
              See the menu
            </Link>
            <Link to="/katha-ai" data-testid="final-katha-ai-cta" className="btn-quiet">
              Ask Kathā AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;