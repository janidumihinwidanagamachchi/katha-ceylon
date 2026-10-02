import { useState } from "react";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { reserveTable, siteUrl } from "@/lib/api";

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
    lines: ["kathaceylon@gmail.com"],
    testid: "visit-contact",
  },
];

/**
 * Inputs get a real surface rather than `bg-transparent`: on the near-black
 * night page a transparent field is just a hairline with no shape, and the
 * placeholder was set at 70% soft ink, which is under the contrast floor.
 * `text-[0.9375rem]` is already 15px; the coarse-pointer rule in index.css
 * takes it to 16px on touch so iOS does not zoom the page on focus.
 */
const inputClass =
  "min-h-11 w-full border border-rule bg-stock px-4 py-3 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-soft transition-colors duration-200 focus:border-ink focus:outline-none";

const Visit = () => {
  const [form, setForm] = useState({ name: "", email: "", date: "", guests: 2, notes: "" });
  const [busy, setBusy] = useState(false);
  // A past date is not a reservation. Computed once on mount so the value is
  // a plain ISO day string rather than a locale-formatted date.
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await reserveTable({ ...form, guests: Number(form.guests) });
      toast.success("Table reserved", { description: res.message });
      setForm({ name: "", email: "", date: "", guests: 2, notes: "" });
    } catch {
      toast.error("Could not reserve", { description: "Please try again in a moment." });
    } finally {
      setBusy(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div data-testid="visit-page">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <span className="field">Visit</span>
            <span className="field">Kynsey Road · Colombo 07</span>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 py-12 lg:grid-cols-12">
            <h1 className="display text-[2.75rem] leading-[1] sm:text-5xl lg:col-span-7">
              The story continues at the table.
            </h1>
            <p className="copy max-w-[42ch] self-end text-[0.9375rem] text-ink-soft lg:col-span-5">
              Book a table, or just come in. Either way, the ledger is open.
            </p>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------- practicals */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[86rem] gutter py-12">
          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3">
            {INFO.map((c, i) => (
              <div key={c.t} className="border-t border-rule py-6 md:pr-8" data-testid={c.testid}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="field">{c.t}</h2>
                  <c.icon size={16} className="text-brass" aria-hidden="true" />
                </div>
                <div className="mt-4 space-y-0.5">
                  {c.lines.map((l) => (
                    <p key={l} className="text-sm leading-relaxed text-ink">
                      {/* the one line that is actionable: make it a real link,
                          not something a visitor has to select and retype */}
                      {c.testid === "visit-contact" && l.includes("@") ? (
                        <a
                          href={`mailto:${l}`}
                          className="wipe"
                          data-testid="visit-email-link"
                          translate="no"
                        >
                          {l}
                        </a>
                      ) : (
                        l
                      )}
                    </p>
                  ))}
                </div>
                <span className="field tnum mt-4 block text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- form + card */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[86rem] gutter">
          <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="field mb-5">01 — Reservations</p>
              <h2 className="display mb-7 text-3xl leading-[1.05] sm:text-4xl">
                Reserve a table.
              </h2>

              <form onSubmit={submit} className="space-y-7" data-testid="reservation-form" aria-busy={busy}>
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-name" className="field mb-2 block">
                      Name
                    </label>
                    <input
                      id="res-name"
                      name="name"
                      autoComplete="name"
                      enterKeyHint="next"
                      required
                      placeholder="Your name…"
                      data-testid="reservation-name-input"
                      {...field("name")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="res-email" className="field mb-2 block">
                      Email
                    </label>
                    <input
                      id="res-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      enterKeyHint="next"
                      required
                      placeholder="you@example.com"
                      data-testid="reservation-email-input"
                      {...field("email")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="res-date" className="field mb-2 block">
                      Date
                    </label>
                    <input
                      id="res-date"
                      name="date"
                      type="date"
                      autoComplete="off"
                      enterKeyHint="next"
                      min={today}
                      required
                      data-testid="reservation-date-input"
                      {...field("date")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="res-guests" className="field mb-2 block">
                      Guests
                    </label>
                    <select
                      id="res-guests"
                      name="guests"
                      autoComplete="off"
                      data-testid="reservation-guests-select"
                      {...field("guests")}
                      className={inputClass}
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} guest{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="res-notes" className="field mb-2 block">
                    Anything we should know
                  </label>
                  <textarea
                    id="res-notes"
                    name="notes"
                    rows={3}
                    enterKeyHint="done"
                    placeholder="An occasion, a dietary note, a dish you are hoping to taste…"
                    data-testid="reservation-notes-input"
                    {...field("notes")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  data-testid="reservation-submit-button"
                  className="btn disabled:opacity-50"
                >
                  {busy ? "Reserving…" : "Reserve a table"}
                </button>
              </form>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <p className="field mb-5">02 — The table card</p>

              <div className="border border-ink bg-band p-7 text-on-band" data-testid="visit-table-card">
                <p className="display text-3xl leading-[1.05]">
                  Scan.
                  <br />
                  Taste.
                  <br />
                  Read.
                </p>
                <p className="copy mt-5 text-sm text-on-band/70">
                  One code opens the whole storybook — the menu, the four regions, and the
                  story behind every dish.
                </p>
                <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {/* stays dark-on-white in both modes so it always scans */}
                  <div
                    className="shrink-0 bg-white p-3"
                    data-testid="website-qr"
                    role="img"
                    aria-label="QR code that opens the Kathā Ceylon menu on a phone"
                  >
                    <QRCodeSVG value={siteUrl()} size={104} fgColor="#14201C" bgColor="#FFFFFF" level="M" />
                  </div>
                  <p className="max-w-[24ch] text-xs leading-relaxed text-on-band/70">
                    Point your camera at the code — no app needed.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-rule pt-7" data-testid="visit-socials">
                <p className="field mb-4">Follow</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/katha.ceylon?stkn=MWltczFxdTdsaW91aw=="
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    data-testid="social-instagram"
                    className="grid h-11 w-11 place-items-center border border-rule text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:bg-stock"
                  >
                    <Instagram size={16} />
                  </a>
                  <a
                    href="mailto:kathaceylon@gmail.com"
                    aria-label="Email"
                    data-testid="social-email"
                    className="grid h-11 w-11 place-items-center border border-rule text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink active:bg-stock"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visit;