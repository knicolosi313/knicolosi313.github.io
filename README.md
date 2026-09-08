# Keith Nicolosi | Portfolio

My personal portfolio site. Hand-built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

**Live:** [keithnicolosi.com](https://keithnicolosi.com)

![Keith Nicolosi, Software Engineer](images/og-image.png)

---

## About

A portfolio covering my background, selected projects, technical stack, and experience, with a dedicated case study page for each project. The design is built around a dark "research lab" aesthetic: a deep void background with a slow-drifting aurora field, frosted glass panels, and film grain to keep the gradients from banding.

Everything is written by hand. There is no framework, no bundler, and no `node_modules`. The site is plain HTML, CSS, and JavaScript plus images, served exactly as it is written.

## Design

- **Aurora field**: three large blurred radial gradients drifting on 26s / 32s / 38s cycles at different rates, so the background never visibly loops. Transform-only animation, so it stays on the compositor.
- **Glass panels**: `backdrop-filter` with a top-edge highlight gradient, so panels catch light rather than looking like flat translucent boxes.
- **Pointer-tracked glow**: a soft light follows the cursor across the aurora. Disabled on touch devices and under reduced-motion.
- **Film grain**: an inline SVG `feTurbulence` layer at 3.2% opacity, deliberately placed *below* the content layer so it smooths gradient banding without softening text.

## Performance

Total first-load payload for the landing page is **74 KB**:

| Asset | Size |
|---|---|
| `styles.css` | 25.1 KB |
| `index.html` | 21.2 KB |
| `me.webp` | 15.5 KB |
| `favicon.ico` | 6.4 KB |
| `script.js` | 6.0 KB |

Case study pages reuse `styles.css` and `script.js` from cache and add only
`project.css` (9.1 KB) on top of their own markup.

The portrait is served as WebP with a JPEG fallback through `<picture>`, sized at 2× its display slot for retina. Images carry explicit dimensions to prevent layout shift.

## Accessibility

- Skip-to-content link
- Full `prefers-reduced-motion` support: animations, the aurora, and the pointer glow all disable
- Semantic landmarks, `aria-expanded` on the mobile nav toggle, labelled sections
- Visible focus rings on all interactive elements
- Keyboard-dismissable mobile navigation

The scroll-reveal animation degrades safely: above-the-fold content is revealed on load without relying on `IntersectionObserver`, and a failsafe reveals everything below the fold if the observer never reports, so the page can never be left blank if the API is suspended or unsupported.

## Structure

```
├── index.html          # Landing page markup
├── projects/           # One case study page per project
│   ├── cramai.html
│   ├── finrobot.html
│   ├── cineml.html
│   └── portfolio.html
├── styles/
│   ├── styles.css      # Shared styles, design tokens at the top
│   └── project.css     # Case study layout only
├── javascript/
│   └── script.js       # Reveal, scrollspy, nav, pointer glow
├── images/             # Portrait, favicons, social card
├── site.webmanifest
└── README.md
```

## Running locally

The site uses relative paths, so you can open `index.html` directly in a browser. To serve it over HTTP instead:

```bash
npx serve .
```

## Deployment

Deployed via GitHub Pages from the `main` branch. No build step or CI configuration is required; GitHub serves the files as-is.

## Development

Designed and built from scratch, with layout, motion, and typography refined through AI-assisted, experimentation-driven iteration.

---

© 2026 Keith Nicolosi
