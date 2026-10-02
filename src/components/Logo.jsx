import { asset } from "@/lib/images";

/**
 * The Kathā Ceylon badge is a photographic crop, not an SVG, so the mark and
 * the wordmark are kept separate: the badge is a 42px circle in the navbar and
 * scales up in the footer and the Our Story hero.
 */
export const LogoMark = ({ size = 42, className = "" }) => (
  <img
    src={asset("/brand/katha-badge.jpg")}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={`brand-badge shrink-0 rounded-full object-cover ${className}`}
  />
);

const Logo = ({ size = 42 }) => (
  <span className="flex items-center gap-3" data-testid="brand-logo">
    <LogoMark size={size} />
    <span className="display text-xl leading-none sm:text-2xl">
      {/* brass-text, not text-brass: at 20–24px this is still normal text and
          needs 4.5:1, which the mark brass does not reach on paper. */}
      Kathā <span className="brass-text italic">Ceylon</span>
    </span>
  </span>
);

export default Logo;