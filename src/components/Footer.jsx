import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import Logo from "@/components/Logo";

const PHONE = { text: "+94 77 123 4567", href: "tel:+94771234567" };

const SOCIALS = [
  {
    href: "https://www.instagram.com/katha.ceylon?stkn=MWltczFxdTdsaW91aw==",
    label: "Instagram",
    Icon: Instagram,
  },
  { href: "mailto:kathaceylon@gmail.com", label: "Email", Icon: Mail },
  {
    href: "https://www.tiktok.com/@katha.ceylon?_r=1&_t=ZS-9ADPy8vnaWy",
    label: "TikTok",
    /**
     * lucide dropped its brand glyphs, so there is no TikTok icon to import.
     * This is the official mark from Simple Icons (a 24x24 single path), inlined
     * rather than guessed at.
     */
    Icon: ({ size = 16, ...rest }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const COLUMNS = [
  {
    heading: "The Ledger",
    links: [
      { to: "/menu", label: "All dishes" },
      { to: "/explore?region=nuwara-eliya", label: "Nuwara Eliya" },
      { to: "/explore?region=kurunegala", label: "Kurunegala" },
      { to: "/explore?region=galle", label: "Galle" },
      { to: "/explore?region=colombo", label: "Colombo" },
    ],
  },
  {
    heading: "The Café",
    links: [
      { to: "/our-story", label: "Our story" },
      { to: "/katha-ai", label: "Kathā AI" },
      { to: "/visit", label: "Visit us" },
    ],
  },
];

const Footer = () => (
  <footer
    className="safe-bottom mt-28 border-t border-rule bg-stock sm:mt-36"
    data-testid="site-footer"
  >
    <div className="mx-auto max-w-[86rem] gutter py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size={52} />
          <p className="quotation mt-6 max-w-[22ch] text-xl sm:text-2xl">
            Traditional flavours, modern stories.
          </p>
          <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-soft">
            French patisserie technique retold through Sri Lanka — highland tea, kithul
            treacle, true cinnamon, king coconut.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} className="md:col-span-2">
            <p className="field mb-4">{col.heading}</p>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link
                    to={l.to}
                    className="flex min-h-11 items-center text-sm text-ink-soft hover:text-ink"
                  >
                    <span className="wipe">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-3">
          <p className="field mb-4">Find us</p>
          <address className="not-italic text-sm leading-relaxed text-ink-soft">
            <a
              href="https://maps.google.com/?q=24+Galle+Road+Colombo+04+Sri+Lanka"
              target="_blank"
              rel="noreferrer"
              className="wipe"
            >
              24 Galle Road
            </a>
            <br />
            Colombo 04
            <br />
            Sri Lanka
          </address>
          <p className="mt-4 text-sm text-ink-soft tnum">Daily 08:00 — 22:00</p>
          <p className="mt-1 text-sm">
            <a href={PHONE.href} className="wipe" translate="no">
              {PHONE.text}
            </a>
          </p>

          {/* These were on the Visit page until the reservations block was
              removed; the footer is the last place they live. */}
          <p className="field mt-8 mb-4">Follow</p>
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                data-testid={`footer-${label.toLowerCase()}`}
                className="grid h-11 w-11 place-items-center border border-rule text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:bg-paper"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="field">Kathā Ceylon · Est. Colombo</p>
        <p className="field" translate="no">kāṭhā (කථා) — story</p>
      </div>
    </div>
  </footer>
);

export default Footer;