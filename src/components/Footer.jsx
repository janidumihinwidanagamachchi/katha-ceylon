import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

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
            <a href="https://maps.google.com/?q=24+Galle+Road+Colombo+04+Sri+Lanka" target="_blank" rel="noreferrer" className="wipe">
              24 Galle Road
            </a>
            <br />
            Colombo 04
            <br />
            Sri Lanka
          </address>
          <p className="mt-4 text-sm text-ink-soft tnum">Daily 08:00 — 22:00</p>
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