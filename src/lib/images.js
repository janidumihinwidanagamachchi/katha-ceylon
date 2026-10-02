/**
 * Responsive image descriptors.
 *
 * Every family in this site is over-served by a wide margin: a chapter
 * photograph is 3024px wide and lands in a 427px column, a patisserie plate is
 * 3429px and lands in 528px. With no srcset the browser hands every device the
 * full-resolution original, so a phone pays ~2.2MB for a fallback it displays
 * at 350px.
 *
 * These helpers build the srcset/sizes pair for each family from the
 * derivatives that exist on disk. Widths are listed explicitly rather than
 * globbed, because an srcset entry with no matching file is a 404 that only
 * shows up on the devices you did not test on.
 *
 * Every candidate carries a width descriptor. A srcset may not mix `url` with
 * `url 400w`, so the base file is listed with its own intrinsic width.
 */
const SIZES = {
  // three-up on desktop, two-up on tablet, single column on a phone
  dish: "(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw",
  // the same dish shown large on its own story page
  dishLarge: "(min-width: 1024px) 730px, 92vw",
  // portrait media column beside the chapter copy
  region: "(min-width: 1024px) 427px, 92vw",
  // a plate in a six-column well
  plate: "(min-width: 1024px) 528px, 92vw",
  // full-bleed masthead
  hero: "100vw",
};

/**
 * Prefixes a public asset path with the deployment base.
 *
 * Vite rewrites absolute URLs found in HTML and CSS, but it does not touch
 * absolute paths inside JS string literals — so "/images/dishes/x.jpg" written
 * in a data file would keep requesting the domain root and 404 on a project
 * Pages site, which is served from /katha-ceylon/. Rather than prefix all
 * forty-odd paths in the content files by hand, they stay clean and every one
 * of them is resolved here, at the point it is turned into a request.
 *
 * BASE_URL is "/" in dev and "/katha-ceylon/" in a production build.
 */
export const asset = (path) =>
  `${import.meta.env.BASE_URL ?? "/"}${String(path).replace(/^\/+/, "")}`;

/**
 * @param src      the original's public path, e.g. "/images/dishes/tea-eclair.jpg"
 * @param widths   derived widths that exist alongside it, e.g. [400, 800]
 * @param original the original's intrinsic width, e.g. 1254
 * @param sizes    the sizes attribute for wherever it is rendered
 */
const responsive = (src, widths, original, sizes) => {
  const stem = asset(src).replace(/\.jpg$/, "");
  const candidates = [...new Set([...widths, original])].sort((a, b) => a - b);
  return {
    src: asset(src),
    srcSet: candidates
      .map((w) => `${w === original ? asset(src) : `${stem}-${w}.jpg`} ${w}w`)
      .join(", "),
    sizes,
  };
};

/** Dish cards in a grid. */
export const dishImage = (src) => responsive(src, [400, 800], 1254, SIZES.dish);

/** The same dish, full width on its own story page. */
export const dishImageLarge = (src) => responsive(src, [400, 800], 1254, SIZES.dishLarge);

/** Region photographs: the chapter fallback when a loop will not play. */
export const regionImage = (src) => responsive(src, [480, 854, 1200], 3024, SIZES.region);

/** Plates: the patisserie counter and the montage. */
export const plateImage = (src) => responsive(src, [640, 1080, 1600], 3429, SIZES.plate);

/**
 * The café interior. A 16:9 photograph whose original is only 1280px wide, so
 * it stops there rather than deriving a 1600 that would be an upscale.
 */
export const cafeImage = (src) => responsive(src, [640, 1080], 1280, SIZES.plate);

/**
 * The montage is only 1312px wide to begin with, so it gets no 1600 derivative
 * and the original doubles as its widest candidate.
 */
export const montageImage = (src) => responsive(src, [640, 1080], 1312, SIZES.plate);

/**
 * The spice drawer is the reverse case: the original is a 540px crop that the
 * plate upscales, so the *derivative* is the widest candidate and the original
 * is the small one. Listing it that way means a phone gets 57KB and a desktop
 * gets the sharper 1080px render instead of a blown-up 540px.
 */
export const spiceImage = (src) => responsive(src, [1080], 540, SIZES.plate);

/** Full-bleed OurStory hero. */
export const heroImage = (src) => responsive(src, [1080, 1920], 5616, SIZES.hero);