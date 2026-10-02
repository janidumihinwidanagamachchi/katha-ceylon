import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DishCard from "@/components/DishCard";
import { getDish, paragraphs } from "@/lib/api";
import { regionInk } from "@/content/regions";
import { iconFor } from "@/content/icons";
import { dishImageLarge } from "@/lib/images";

/** One labelled value in the data rail. */
const Field = ({ label, children, className = "" }) => (
  <div className={`border-t border-rule py-3 ${className}`}>
    <dt className="field">{label}</dt>
    <dd className="copy mt-1.5 text-sm leading-snug text-ink">{children}</dd>
  </div>
);

const DishStory = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    getDish(slug).then(setData).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="gutter mx-auto max-w-[86rem] py-32" data-testid="dish-not-found">
        <p className="field mb-4">No such lot</p>
        <p className="quotation max-w-[24ch]">This story hasn&rsquo;t been written yet.</p>
        <Link
          to="/menu"
          data-testid="dish-back-to-menu"
          className="btn-quiet mt-8"
        >
          Back to the menu
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gutter mx-auto max-w-[86rem] py-32 text-sm text-ink-soft" data-testid="dish-loading">
        Opening the ledger…
      </div>
    );
  }

  const { dish, region, suggestions } = data;
  const ink = regionInk(dish.region);
  const Icon = iconFor(dish.icon);
  const largeImage = dishImageLarge(dish.image);

  return (
    <article data-testid="dish-story-page">
      {/* ------------------------------------------------------ lot sheet head */}
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter">
          <div className="flex items-center justify-between gap-6 border-b border-rule py-3">
            <Link
              to="/menu"
              data-testid="dish-back-link"
              className="field inline-flex items-center gap-2 hover:text-ink"
            >
              <ArrowLeft size={12} /> Ledger
            </Link>
            <span className="field">Lot sheet</span>
            <span className={`field tnum ${ink.text}`}>{dish.lot}</span>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-10 py-14 lg:grid-cols-12 lg:py-16">
            <div className="lg:col-span-7">
              <p className="field mb-6">
                {region.chapter} · <span translate="no">{region.name}</span>
              </p>
              <h1
                className="display text-[2.75rem] leading-[1] sm:text-5xl lg:text-[4rem]"
                data-testid="dish-name"
              >
                {dish.name}
              </h1>
            </div>

            <div className="lg:col-span-5">
              <dl className="grid grid-cols-1">
                <Field label="Region">{region.name}</Field>
                <Field label="Epithet">{region.epithet}</Field>
                <Field label="Key ingredient">{dish.keyIngredient}</Field>
                <Field label="Course">{dish.category}</Field>
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------- the plate, then the long-form text */}
      <div className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter py-14 lg:py-20">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <figure>
                <div className="plate aspect-square">
                  <img
                    src={largeImage.src}
                    srcSet={largeImage.srcSet}
                    sizes={largeImage.sizes}
                    alt={dish.name}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>

            <div className="lg:col-span-5">
              <p className="field mb-5">The story</p>
              <div
                className="prose-ledger"
                data-testid="dish-story-text"
              >
{paragraphs(dish.story).map((p, i) => (
                    <p
                      key={i}
                      /* the drop cap is a 3.5rem float; at 320px it steals a
                         third of the measure, so it only stands from sm up */
                      className={
                        i === 0
                          ? "sm:first-letter:float-left sm:first-letter:mr-3 sm:first-letter:mt-1 sm:first-letter:font-display sm:first-letter:text-[3.25rem] sm:first-letter:leading-[0.8] sm:first-letter:text-brass"
                          : undefined
                      }
                    >
                      {p}
                    </p>
                  ))}
              </div>

              {dish.pullQuote && (
                <p className="quotation mt-7 border-l-2 border-brass pl-5 text-xl sm:text-2xl">
                  {dish.pullQuote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- modern twist + ingredients */}
      <div className="border-b border-rule bg-stock">
        <div className="mx-auto max-w-[86rem] gutter py-14">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="field mb-5">On the plate</p>
              <dl data-testid="dish-ingredients">
                {(dish.ingredients ?? []).map((ing, i) => (
                  <div
                    key={ing}
                    className="flex items-baseline gap-4 border-t border-rule py-2.5 last:border-b"
                  >
                    <span className="field tnum w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-ink">{ing}</span>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-6 lg:col-start-7" data-testid="dish-modern-twist">
              <p className="field mb-5">The modern twist</p>
              <p className="display text-2xl leading-[1.25] sm:text-3xl">{dish.modernTwist}</p>
              <p className="copy mt-5 flex items-center gap-2 text-sm text-ink-soft">
                <Icon size={15} className={ink.text} aria-hidden="true" />
                Served in <span translate="no">{region.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ further reading */}
      {suggestions?.length > 0 && (
        <section className="py-20 sm:py-28" data-testid="dish-cross-links">
          <div className="mx-auto max-w-[86rem] gutter">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-12">
              <div className="md:col-span-1">
                <span className="field tnum">→</span>
              </div>
              <div className="md:col-span-7">
                <h2 className="display text-3xl leading-[1.05] sm:text-4xl">
                  Other lots from {region.name}
                </h2>
              </div>
              <div className="flex items-start md:col-span-4 md:justify-end">
                <Link to={`/explore?region=${region.id}`} className="wipe text-sm text-ink">
                  Read the {region.name} chapter
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {suggestions.map((s, i) => (
                <DishCard key={s.slug} dish={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default DishStory;