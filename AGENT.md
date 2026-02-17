# Repository Guide

## Top-level layout
- `index.html`, `css/main.css`, and `js/webflow.js` (removed) are the single-page entry point for the current Third Eye Craft Affair site. Everything else should be considered auxiliary or archival.
- `CNAME`, `README.md`, and GitHub Pages workflow remain to support deployment.

## Media
The `media/` directory is split by usage:
- `media/` contains hero/carousel assets (posters, flyers, Signal QR) plus any raw photos directly embedded in the live `index.html` and `css/main.css`.
- `media/assets/` houses logos, icons, and other static graphics that may be shared across the site or future layouts.
- `media/eventCarousel/` stores the flyers and “save the date” graphics that feed the carousel on the homepage.
- `media/eventPhotos/` captures various event photography; treat these as the gallery tiles used throughout the page.
- `media/testimonials/` keeps the short quotes, reviews, or testimonial snippets that can be surfaced in the community voices/testimonial sections.

## Notes/Context
- `base/` is the source of truth for how the site should be structured: `pageNotes.txt` outlines the sections and tone, while `Language Guide.txt` (if needed) ensures copy/narrative consistency.
- Any other text, CSV, or JSON files should be considered historic artifacts. Keep them only if you expect to onboard new content/formats in the near future.

## Workflow hints
- Keep all new development centered on `index.html`, `css/main.css`, and the media assets actually referenced there.
- When pruning media, double-check `rg 'media/'` to ensure no broken references.
- If you add new folders under `media/`, mirror this document so future contributors know each subdir’s intent.
