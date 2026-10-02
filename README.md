# Kathā Ceylon

A Sri Lankan-inspired café site built as an estate ledger: four regional
chapters, twenty-eight lots, and a story attached to every dish.

Kāṭhā (කථා) means *story* in Sinhala. The premise is that a dish should arrive
with the region it came from attached to it, so each chapter pairs a plate of
photography with the history and ingredients behind it, and a QR code on the
table opens the whole thing.

## Stack

| | |
|---|---|
| Build | Vite 6 |
| UI | React 18, React Router 6 |
| Styling | Tailwind CSS 3.4, with all colour as CSS custom properties |
| Animation | Framer Motion 11 |
| Scroll | Lenis |
| Theme | next-themes, class strategy, `system` by default |
| Data fetching | TanStack Query (the catalogue itself is local and synchronous) |

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:3000
```

```bash
npm run build            # -> dist/
npm run preview          # serve the built output
```

The site runs entirely from `src/content`. The remote API is only a fallback
for a slug that is missing locally, so you can develop with no backend at all.

## Where things live

```
src/
  content/          the catalogue — regions and dishes. Edit copy here.
    regions.js      four chapters, each with its own colour, history and loop
    dishes.js       twenty-eight lots, their ingredients and stories
    island.js       the Sri Lanka outline traced from Natural Earth
  lib/
    api.js          reads the local catalogue, falls back to the API
    images.js       responsive srcset/sizes descriptors per image family
    smoothScroll.js the single Lenis instance
  pages/            one file per route
  components/       Navbar, Footer, DishCard, the plates, the reveal budget
  index.css         design tokens, night mode, component layer
```

### Design system

Colour is a set of RGB triples in `src/index.css` (`--paper`, `--ink`, `--tea`,
`--brass` and so on), which is what lets night mode be a single block that
re-aims every token at once. Nothing in the components hardcodes a colour.

Brass is split in two on purpose: `--brass` is the mark colour and only clears
3:1, which is all a rule or a focus ring needs, while `--brass-ink` and
`--brass-ink-on-band` clear 4.5:1 for the 11px ledger labels that use brass as
text. One brass cannot do both jobs on both surfaces.

## Media pipeline

Photography and video are pre-processed with `ffmpeg` and committed, rather
than transformed at build time, so a clone builds without any image tooling.

**Responsive derivatives.** Every image family ships right-sized variants named
`<name>-<width>.jpg` alongside the original, and `src/lib/images.js` builds the
`srcset`/`sizes` pair for each. Widths are listed explicitly rather than
globbed, because an `srcset` entry pointing at a missing file is a 404 that
only shows up on devices you did not test on.

Dish cards render at 350–400px but the originals are 1254px, so a phone would
otherwise download 319KB to fill a 350px box. It now gets 31KB.

**Chapter loops.** `public/video/regions/` holds one silent 9:16 clip per
region, encoded for the web and used only by `src/components/ChapterPlate.jsx`:

```bash
ffmpeg -i source.mp4 -an \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 26 -preset slow -g 60 -keyint_min 60 -sc_threshold 0 \
  -movflags +faststart out.mp4
```

`-an` strips audio (autoplay requires muted anyway), `-g 60` puts a keyframe
every two seconds so the loop seam stays smooth, and `+faststart` hoists the
moov atom so playback begins before the file finishes downloading.

The component degrades to the chapter photograph in four separate cases —
reduced motion, autoplay refused, decode failure, missing source — so a
reduced-motion visitor is never left looking at an empty frame.

## Accessibility and motion notes

- Every interactive target is at least 44×44px; hover states are gated behind
  `(hover: hover)` so they cannot stick after a tap
- `prefers-reduced-motion` stands down the plate rotation, the chapter loops,
  the chat typing indicator and the smooth-scroll engine
- The transcript is a `role="log"` live region, so a streamed answer is
  announced as it settles
- The mobile drawer traps focus, closes on Escape, and returns focus to the
  control that opened it
- Contrast is verified for every text-on-surface pairing in both modes, not
  assumed

## Not included

- No LICENSE file, so GitHub's default applies: all rights reserved. This is a
  commercial site; add one deliberately if that changes.
- No CI or deploy pipeline. `dist/` is a plain static build.