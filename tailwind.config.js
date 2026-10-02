import tailwindcssAnimate from "tailwindcss-animate";

/**
 * "Estate Ledger" — a Ceylon tea-estate ledger crossed with a patisserie menu
 * card. Hairline rules and tabular numerals do the separating that cards and
 * shadows used to do, so every colour here is an RGB triple and can be
 * re-aimed for night mode from one block in index.css.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Touch has no hover, so the browser fakes one and leaves it stuck after a
  // tap. Compiling `hover:` behind a capability query is the fix.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Base surfaces
        paper: "rgb(var(--paper) / <alpha-value>)",
        stock: "rgb(var(--stock) / <alpha-value>)",
        well: "rgb(var(--well) / <alpha-value>)",

        // Text
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",

        // Structure + accents
        tea: "rgb(var(--tea) / <alpha-value>)",
        brass: "rgb(var(--brass) / <alpha-value>)",
        // Brass splits into a mark colour and two text colours. The mark colour
        // clears 3:1, which is all a rule or a focus ring needs; text needs
        // 4.5:1 and no single brass reaches it on both paper and the band.
        "brass-ink": "rgb(var(--brass-ink) / <alpha-value>)",
        "brass-ink-on-band": "rgb(var(--brass-ink-on-band) / <alpha-value>)",
        rub: "rgb(var(--rub) / <alpha-value>)",
        "rub-ink": "rgb(var(--rub-ink) / <alpha-value>)",
        indigo: "rgb(var(--indigo) / <alpha-value>)",

        // Hairlines
        rule: "rgb(var(--rule) / <alpha-value>)",

        // Inverted bands
        band: "rgb(var(--band) / <alpha-value>)",
        "on-band": "rgb(var(--on-band) / <alpha-value>)",

        // shadcn-compatible aliases so third-party components stay tokenised
        border: "rgb(var(--rule) / <alpha-value>)",
        input: "rgb(var(--rule) / <alpha-value>)",
        ring: "rgb(var(--brass) / <alpha-value>)",
        background: "rgb(var(--paper) / <alpha-value>)",
        foreground: "rgb(var(--ink) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--brass) / <alpha-value>)",
          foreground: "rgb(var(--paper) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--stock) / <alpha-value>)",
          foreground: "rgb(var(--ink-soft) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          foreground: "rgb(var(--ink) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          foreground: "rgb(var(--ink) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--tea) / <alpha-value>)",
          foreground: "rgb(var(--on-band) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--rub) / <alpha-value>)",
          foreground: "rgb(var(--paper) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Bodoni Moda"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        ledger: "0.14em",
      },
      keyframes: {
        "rule-draw": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "wipe-in": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "fade-settle": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "plate-in": {
          from: { opacity: "0", clipPath: "inset(0 0 100% 0)" },
          to: { opacity: "1", clipPath: "inset(0 0 0% 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.7", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(2.6)" },
        },
      },
      animation: {
        "rule-draw": "rule-draw 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "wipe-in": "wipe-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-settle": "fade-settle 700ms ease-out forwards",
        "plate-in": "plate-in 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        marquee: "marquee 46s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};