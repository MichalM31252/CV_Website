# Portfolio — Michał Malinowski

Personal portfolio / CV site, designed as **"The Pipeline"** — a data
scientist's CV as a living ETL pipeline. Sections are pipeline stages accented
with the Databricks medallion colors (bronze → silver → gold), a glowing spine
fills as you scroll with particles streaming down it, and the hero is a
particle flow field. Plain HTML, CSS, and JavaScript — no framework, no build
step, deliberately dark-only.

## Stack

- Static HTML + vanilla CSS custom properties + vanilla JS
- Fonts from Google Fonts: [Unbounded](https://fonts.google.com/specimen/Unbounded)
  (display), [Schibsted Grotesk](https://fonts.google.com/specimen/Schibsted+Grotesk)
  (body), [Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono)
  (labels & data)
- Motion: hero flow-field canvas, character-decode name reveal, scroll-driven
  spine fill with traveling particles, staggered reveals, dual skill marquees,
  3D-tilt project cards, wave-animated GitHub heatmap, count-up stats, magnetic
  contact button — all disabled under `prefers-reduced-motion`
- Live data fetched client-side: GitHub profile (repo count) and
  [github-contributions-api](https://github.com/grubersjoe/github-contributions-api)
  (heatmap + contribution stat; the section hides itself if unreachable)

## Project structure

```
index.html        All content and markup
css/styles.css    All styling (design tokens at the top)
js/main.js        All behavior and animation
```

## Editing content

All copy lives directly in [`index.html`](index.html). The palette and type
scale live in the `:root` token block at the top of
[`css/styles.css`](css/styles.css).

## Running locally

Any static server works (the live GitHub data needs `http://`, not `file://`):

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Static files only — deploy the repository root as-is (e.g. GitHub Pages).
