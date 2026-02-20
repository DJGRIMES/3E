## Carousel manifest workflow

This folder is the source of truth for the save-the-date carousel on the homepage. Treat it as a mini CMS:

1. **Add or refresh an asset** – drop the new graphic (`.jpg`, `.png`, etc.) directly into this directory.
2. **Extend `manifest.json`** – append entries to `"items"` in the order you want them to appear. Each entry must include:
   * `filename`: the exact file name residing in this folder.
   * `alt`: the text that will be emitted into the `<img>` alt attribute.
   * `indicatorLabel`: the `aria-label` for the Bootstrap indicator button.
   * `metadata` (optional): any structured data you may want to expose later (captions, dates, etc.).
3. **Open or refresh `index.html`** – the client-side loader at `js/media.js` reads this manifest at runtime, builds the Bootstrap carousel, and inserts both the indicator controls and slides into the placeholder on the page. There is no CLI step; just refresh the page served over HTTP so the browser can hydrate the carousel.

If the manifest is malformed or a file fails to load, the script logs diagnostics to the browser console and leaves a small notice in the carousel slot so you can catch the issue during preview.
