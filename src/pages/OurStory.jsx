import { Link } from "react-router-dom";
import { LogoMark } from "@/components/Logo";
import { heroImage } from "@/lib/images";

const SPICES_IMG = "/img/ceylon-spices.jpg";
const HERO = heroImage("/img/tea-highlands.jpg");

const VALUES = [
  { t: "Heritage", d: "Recipes and rituals carried across generations of the island." },
  { t: "Authenticity", d: "True cinnamon, single-origin tea, real kithul — never imitations." },
  { t: "Technique", d: "French patisserie method in conversation with Ceylonese flavour." },
  { t: "Connection", d: "A code on every plate, so diner and story always meet." },
  { t: "Locality", d: "Four regions, one menu — every ingredient traced to its landscape." },
];

const TIMELINE = [
  {
    y: "Chapter One",
    t: "A pop-up in Colombo",
    d: "Twelve seats, one oven, and a single idea: what if every dish came with its story?",
  },
  {
    y: "Chapter Two",
    t: "The menu becomes a map",
    d: "We stopped organising by course and started organising by region — the island became the structure.",
  },
  {
    y: "Chapter Three",
    t: "The first table code",
    d: "A guest scanned, read about Athugala rock while eating the pie named for it, and stayed for two more chapters.",
  },
  {
    y: "Chapter Four",
    t: "Kathā AI",
    d: "The storybook learned to answer back. Ask it anything about the menu, and it speaks only from what we know and cook.",
  },
];

const OurStory = () => (
  <div data-testid="our-story-page">
    {/* ------------------------------------------------------------ the hero */}
    <header className="relative overflow-hidden border-b border-rule">
      {/* svh, not vh: `vh` is the tallest the viewport ever gets, so on a
          phone this hero is 120px taller than the space actually visible and
          the caption starts underneath the URL bar. svh is the smallest and
          never overflows — and it is stable, so scrolling does not resize it. */}
      <div className="relative h-[68svh] min-h-[30rem] w-full">
        <img
          src={HERO.src}
          srcSet={HERO.srcSet}
          sizes={HERO.sizes}
          alt="Tea highlands of Sri Lanka"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-band/55" />
        <div className="absolute inset-0 scrim" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="gutter mx-auto max-w-[86rem] pb-12">
            <div className="flex items-end gap-5">
              <LogoMark size={64} className="hidden shrink-0 sm:block" />
              <div className="min-w-0">
                <p className="field-on-band mb-3">Our story</p>
                <h1 className="display text-[2.75rem] leading-[0.98] text-on-band sm:text-6xl">
                  Kathā means story.
                </h1>
              </div>
            </div>
            <p className="copy mt-6 max-w-[52ch] text-[0.9375rem] text-on-band/85 sm:text-base">
              In Sinhala, a story is a kāthā. We named the café for the thing we believe food
              does best: carry a place, a people and a past into a single bite.
            </p>
          </div>
        </div>
      </div>
    </header>

    {/* ---------------------------------------------------------- why we exist */}
    <section className="border-b border-rule py-20 sm:py-28">
      <div className="mx-auto max-w-[86rem] gutter">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="field mb-5">01 — Why we exist</p>
            <h2 className="display text-3xl leading-[1.05] sm:text-4xl">
              Food, culture and technology at one table.
            </h2>
            <div className="prose-ledger mt-6">
              <p>
                Sri Lanka&rsquo;s flavours are extraordinary — but their stories are usually told
                far from the plate. Kathā Ceylon closes that gap.
              </p>
              <p>
                The menu is organised into four regional chapters, each dish paired with its
                own story page, and each table card carrying a code that opens it. Kathā AI
                answers the questions that arise mid-bite.
              </p>
            </div>
            <p className="quotation mt-7 max-w-[26ch] border-l-2 border-brass pl-5 text-xl sm:text-2xl">
              We don&rsquo;t just serve the island. We narrate it.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <figure>
              <div className="plate aspect-[4/5]">
                <img src={SPICES_IMG} alt="Ceylon cinnamon and spices" loading="lazy" decoding="async" />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4 hairline pt-2.5">
                <span className="field tnum">Plate III</span>
                <span className="text-xs leading-snug text-ink-soft sm:text-[0.8125rem]">
                  True cinnamon, kithul treacle, Ceylon tea
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    {/* ---------------------------------------------------------------- values */}
    <section className="border-b border-rule bg-band text-on-band" data-testid="values-section">
      <div className="gutter mx-auto max-w-[86rem] py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-1">
            <span className="field-on-band brass-text-on-band tnum">02</span>
          </div>
          <h2 className="display text-3xl leading-[1.05] text-on-band sm:text-4xl md:col-span-7">
            Five values, one kitchen.
          </h2>
        </div>

        <dl className="mt-14">
          {VALUES.map((v, i) => (
            <div
              key={v.t}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-t border-on-band/20 py-6 sm:grid-cols-12"
              data-testid={`value-card-${v.t.toLowerCase()}`}
            >
              <dt className="display brass-text-on-band col-span-1 text-xl sm:col-span-3 sm:text-2xl">{v.t}</dt>
              <dd className="copy col-span-1 min-w-0 text-sm text-on-band/75 sm:col-span-8 sm:text-base">
                {v.d}
              </dd>
              <span className="field-on-band tnum col-span-1 hidden sm:col-span-1 sm:block sm:text-right">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </dl>
      </div>
    </section>

    {/* -------------------------------------------------------------- timeline */}
    <section className="py-20 sm:py-28" data-testid="timeline-section">
      <div className="mx-auto max-w-[86rem] gutter">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="field mb-5">03 — The journey</p>
            <h2 className="display text-3xl leading-[1.05] sm:text-4xl">
              From pop-up to storybook café.
            </h2>
            <p className="copy mt-6 max-w-[34ch] text-sm text-ink-soft">
              Four chapters so far. The fifth is whatever the next region turns out to be.
            </p>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6">
            {TIMELINE.map((t, i) => (
              <li
                key={t.y}
                className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-rule py-7 last:border-b"
                data-testid={`timeline-${i}`}
              >
                <span className="field brass-text tnum">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="field mb-2">{t.y}</p>
                  <h3 className="display text-xl leading-tight sm:text-2xl">{t.t}</h3>
                  <p className="copy mt-2 max-w-[52ch] text-sm text-ink-soft">{t.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <Link to="/menu" data-testid="story-menu-cta" className="btn">
            Taste the next chapter
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default OurStory;