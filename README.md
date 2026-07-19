# Portfolio — Michał Malinowski

Personal portfolio / CV site, designed as **"The Actuarial Ledger"** — a data
scientist's CV set like a beautifully typeset report: figure and table labels,
dot-leader ledger rows, tabular numerals, and the classic red margin rule of
ledger paper. Plain HTML, CSS, and JavaScript — no framework, no build step.

## Stack

- Static HTML + vanilla CSS custom properties + vanilla JS
- Fonts from Google Fonts: [Archivo](https://fonts.google.com/specimen/Archivo)
  (variable width, display), [Spectral](https://fonts.google.com/specimen/Spectral)
  (body), [Spline Sans Mono](https://fonts.google.com/specimen/Spline+Sans+Mono)
  (labels & data)
- Light and dark themes via CSS tokens; follows the OS preference, with a
  manual toggle persisted in `localStorage`
- `fig. 01` — career trajectory chart drawn on a `<canvas>` at load
- `fig. 02` — live GitHub contribution calendar fetched client-side from
  [github-contributions-api](https://github.com/grubersjoe/github-contributions-api)
  (the section hides itself if the API is unreachable)

## Project structure

```
index.html        All content and markup
css/styles.css    All styling (design tokens at the top)
js/main.js        Theme toggle, scroll reveal, trajectory chart, GitHub heatmap
```

## Editing content

All copy lives directly in [`index.html`](index.html). The palette and type
scale live in the `:root` token block at the top of
[`css/styles.css`](css/styles.css). The trajectory chart's milestones are the
`MILESTONES` array at the top of [`js/main.js`](js/main.js).

## Running locally

Any static server works (the GitHub heatmap fetch needs `http://`, not `file://`):

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Static files only — deploy the repository root as-is (e.g. GitHub Pages).
