import { Link } from "react-router-dom";
import { regionInk } from "@/content/regions";
import { dishImage } from "@/lib/images";

/**
 * A catalogue entry, not a card. There is no container, no radius and no
 * lift-on-hover — an entry is separated from its neighbours by a hairline and
 * by whitespace. The region colour appears only as the top rule and the
 * course label; the plate itself carries the dish name and description.
 */
const DishCard = ({ dish, index = 0, dense = false }) => {
  const ink = regionInk(dish.region);
  // a phone gets the 400px derivative: 31KB instead of the 319KB original
  const image = dishImage(dish.image);

  return (
    <article className="group relative pt-4">
      <span className={`absolute inset-x-0 top-0 h-px ${ink.line}`} aria-hidden="true" />

      {dense ? (
        <Link
          to={`/dish/${dish.slug}`}
          data-testid={`dish-card-${dish.slug}`}
          className="grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-3.5 transition-colors duration-200 active:bg-stock"
        >
          <span className="field tnum w-7 shrink-0">{dish.lot}</span>
          <span className="min-w-0">
            {/* two lines on a phone, truncated on wider screens: a truncated
                dish name is unreadable at 320px, and these are the real names
                the visitor is scanning for */}
            <span className="line-clamp-2 block font-sans text-[0.9375rem] font-medium leading-snug text-ink sm:truncate">
              {dish.name}
            </span>
            <span className="mt-0.5 line-clamp-1 block truncate text-xs text-ink-soft">
              {dish.keyIngredient}
            </span>
          </span>
          <span className={`field ${ink.text} hidden shrink-0 sm:block`}>{dish.regionName}</span>
        </Link>
      ) : (
        <Link
          to={`/dish/${dish.slug}`}
          data-testid={`dish-card-${dish.slug}`}
          className="block transition-opacity duration-200 active:opacity-80"
        >
          <div className="plate aspect-square">
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes}
              alt={dish.name}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* The card artwork already prints the name and the description, so
              the entry beneath it adds only the two things it cannot: the lot
              number and the course. The visible text stays out of the link and
              goes in the alt so it is not announced twice. */}
          <div className="mt-3.5 flex items-baseline justify-between gap-3 hairline pt-3">
            <span className="field tnum">Lot {dish.lot}</span>
            <span className={`field ${ink.text}`}>{dish.category}</span>
          </div>
        </Link>
      )}
    </article>
  );
};

export default DishCard;