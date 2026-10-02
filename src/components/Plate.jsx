/**
 * A photograph set like a plate in an estate catalogue: rectangular, no arch,
 * no drop shadow, no gradient decoration, and captioned underneath with real
 * ledger fields. The caption is part of the design, not an overlay — which is
 * why captions that need to sit on top of the image get the .scrim treatment
 * and this one does not.
 */
export const Plate = ({
  src,
  alt,
  lot,
  caption,
  meta,
  ratio = "aspect-[4/5]",
  sizes,
  className = "",
  eager = false,
}) => (
  <figure className={className}>
    <div className={`plate ${ratio}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(sizes ? { sizes } : {})}
      />
    </div>
    {(lot || caption || meta) && (
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 hairline pt-2.5">
        {lot && <span className="field tnum shrink-0">{lot}</span>}
        {caption && (
          <span className="font-sans text-xs leading-snug text-ink-soft sm:text-[0.8125rem]">
            {caption}
          </span>
        )}
        {meta && <span className="field shrink-0">{meta}</span>}
      </figcaption>
    )}
  </figure>
);

/**
 * The section opener. There is deliberately no tracked-out label above every
 * heading — the heading either carries a number (because the content really is
 * sequential) or it carries an optional short field on the same baseline.
 */
export const SectionHead = ({ number, field, title, lede, className = "" }) => (
  <header className={`grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-12 ${className}`}>
    <div className="md:col-span-1">
      {number && <span className="field tnum">{number}</span>}
    </div>
    <div className="md:col-span-7">
      <h2 className="display text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]">{title}</h2>
      {lede && (
        <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-ink-soft">{lede}</p>
      )}
    </div>
    {field && (
      <div className="md:col-span-4 md:text-right">
        <span className="field">{field}</span>
      </div>
    )}
  </header>
);

/** The running page frame: a narrow field column beside a wide measure. */
export const PageFrame = ({ children, field, className = "" }) => (
  <div className={`mx-auto w-full max-w-[86rem] gutter ${className}`}>
    <div className="grid grid-cols-1 gap-x-10 md:grid-cols-12">
      {field && (
        <div className="hidden md:col-span-2 md:block">
          <div className="sticky top-28">{field}</div>
        </div>
      )}
      <div className={field ? "md:col-span-10" : "md:col-span-12"}>{children}</div>
    </div>
  </div>
);