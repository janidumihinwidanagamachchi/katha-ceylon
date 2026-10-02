import { Clock, MapPin, Phone } from "lucide-react";

/**
 * A line is either a plain string or a { text, href } pair. Carrying the href
 * on the line itself means the renderer does not care *what* a line links to —
 * it previously had to test `testid === "visit-contact" && l.includes("@")`
 * just to recognise an email address, which meant adding a phone number would
 * have meant adding a third special case.
 */
const INFO = [
  {
    icon: MapPin,
    t: "Find us",
    lines: ["Kynsey Road", "Colombo 07", "Sri Lanka"],
    testid: "visit-address",
  },
  {
    icon: Clock,
    t: "Hours",
    lines: ["Mon – Fri", "8:00 – 19:00", "Sat – Sun", "8:00 – 20:00"],
    testid: "visit-hours",
  },
  {
    icon: Phone,
    t: "Contact",
    lines: [
      // display is spaced for reading, the tel: target is not — a space in a
      // tel: URI is not a valid pause and some clients drop the call
      { text: "+94 77 123 4567", href: "tel:+94771234567" },
      { text: "kathaceylon@gmail.com", href: "mailto:kathaceylon@gmail.com" },
    ],
    testid: "visit-contact",
  },
];

const Visit = () => (
  <div data-testid="visit-page">
    <header className="border-b border-rule">
      <div className="gutter mx-auto max-w-[86rem]">
        <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
          <span className="field">Visit</span>
          <span className="field">Kynsey Road · Colombo 07</span>
        </div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 py-12 lg:grid-cols-12">
          <h1 className="display text-[2.75rem] leading-[1] sm:text-5xl lg:col-span-7">
            The story continues at the table.
          </h1>
          <p className="copy max-w-[42ch] self-end text-[0.9375rem] leading-[1.7] text-ink-soft lg:col-span-5">
            {/* the form used to live here, so this line used to promise booking.
                The number below is now the only route to a table, so it names it. */}
            Call <a href="tel:+94771234567" className="wipe" translate="no">+94 77 123 4567</a> to
            book, or just come in. Either way, the ledger is open.
          </p>
        </div>
      </div>
    </header>

    <section className="border-b border-rule">
      <div className="gutter mx-auto max-w-[86rem] py-12">
        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
          {INFO.map((c, i) => (
            <div key={c.t} className="border-t border-rule py-6 md:pr-8" data-testid={c.testid}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="field">{c.t}</h2>
                <c.icon size={16} className="text-brass" aria-hidden="true" />
              </div>
              <div className="mt-4 space-y-0.5">
                {c.lines.map((l) =>
                  typeof l === "string" ? (
                    <p key={l} className="text-sm leading-relaxed text-ink">
                      {l}
                    </p>
                  ) : (
                    <p key={l.href} className="text-sm leading-relaxed text-ink">
                      <a
                        href={l.href}
                        className="wipe"
                        data-testid={`visit-link-${l.href.split(":")[0]}`}
                        /* a phone number and an address are identifiers, not
                           prose — a translator must not helpfully relabel them */
                        translate="no"
                      >
                        {l.text}
                      </a>
                    </p>
                  ),
                )}
              </div>
              <span className="field tnum mt-4 block text-ink-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Visit;