## Photo grid manifest notes

The `photo-grid` section under “Third Eye in Motion” now builds itself in the browser. The loader (`js/media.js`) fetches this manifest at runtime and renders each entry inside the grid element marked with `data-photo-grid-manifest`.

1. **Drop new imagery** into this folder (`.jpg`, `.png`, etc.).
2. **Add or update entries in `manifest.json`**. Order matters—items render top-to-bottom; entries should include:
   * `filename`: the image file name located in `media/eventPhotos/`.
   * `alt`: descriptive text for the `<img>` alt attribute.
   * `metadata` (optional): structured data (like captions) that the script stores on the card for future features.
3. **Reload the page** (served over HTTP). `js/media.js` reads this manifest, clears the loading copy, and builds the grid dynamically.

If the manifest is missing or malformed, the script logs the error to the console and shows a terse warning inside the grid so you can catch it before pushing changes.
