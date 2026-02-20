const DEFAULT_CAROUSEL_MANIFEST = "media/eventCarousel/manifest.json";
const DEFAULT_PHOTO_GRID_MANIFEST = "media/eventPhotos/manifest.json";
const CAROUSEL_SELECTOR = "[data-carousel-manifest]";
const PHOTO_GRID_SELECTOR = "[data-photo-grid-manifest]";

const renderError = (container, message) => {
  console.error("media loader:", message);
  container.textContent = "";
  const notice = document.createElement("div");
  notice.className = "text-danger small";
  notice.textContent = message;
  container.appendChild(notice);
};

const createControlButton = (containerId, direction) => {
  const isPrev = direction === "prev";
  const button = document.createElement("button");
  button.className = `carousel-control-${direction}`;
  button.type = "button";
  button.setAttribute("data-bs-target", `#${containerId}`);
  button.setAttribute("data-bs-slide", direction);

  const iconSpan = document.createElement("span");
  iconSpan.className = `carousel-control-${direction}-icon`;
  iconSpan.setAttribute("aria-hidden", "true");

  const labelSpan = document.createElement("span");
  labelSpan.className = "visually-hidden";
  labelSpan.textContent = isPrev ? "Previous" : "Next";

  button.appendChild(iconSpan);
  button.appendChild(labelSpan);
  return button;
};

const fetchManifest = async (manifestPath, context) => {
  const manifestUrl = new URL(manifestPath, window.location.href);
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`${context} manifest request failed: ${response.status} ${response.statusText}`);
  }
  const manifest = await response.json();
  const items = Array.isArray(manifest.items) ? manifest.items : [];
  if (!items.length) {
    throw new Error(`${context} manifest must contain at least one item`);
  }

  return {
    items,
    baseUrl: new URL(".", manifestUrl).href,
  };
};

const hydrateCarousel = async (container) => {
  const manifestPath = (container.dataset.carouselManifest || DEFAULT_CAROUSEL_MANIFEST).trim();
  if (!manifestPath) {
    renderError(container, "Carousel manifest path missing.");
    return;
  }

  try {
    const { items, baseUrl } = await fetchManifest(manifestPath, "carousel");

    if (!container.id) {
      container.id = `carousel-${Date.now()}`;
    }
    container.textContent = "";

    const carouselId = container.id;

    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";

    const inner = document.createElement("div");
    inner.className = "carousel-inner";

    items.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") {
        console.warn("carousel: skipping invalid manifest entry", entry);
        return;
      }
      const filename = String(entry.filename || "").trim();
      if (!filename) {
        console.warn("carousel: skipping entry without filename", entry);
        return;
      }
      const sourceUrl = new URL(filename, baseUrl).toString();
      const isFirst = index === 0;

      const indicatorLabel =
        entry.indicatorLabel || entry.indicator || entry.label || `Slide ${index + 1}`;

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-bs-target", `#${carouselId}`);
      button.setAttribute("data-bs-slide-to", String(index));
      button.setAttribute("aria-label", indicatorLabel);
      if (isFirst) {
        button.classList.add("active");
        button.setAttribute("aria-current", "true");
      }
      indicators.appendChild(button);

      const slide = document.createElement("div");
      slide.className = `carousel-item${isFirst ? " active" : ""}`;

      const image = document.createElement("img");
      image.className = "d-block w-100 flyer-carousel-image";
      image.src = sourceUrl;
      image.alt = String(entry.alt || "").trim();
      image.addEventListener("error", () => {
        console.warn("carousel: failed to load", sourceUrl);
      });
      slide.appendChild(image);

      const metadata = entry.metadata;
      if (metadata && typeof metadata === "object") {
        slide.dataset.metadata = JSON.stringify(metadata);
      }

      inner.appendChild(slide);
    });

    container.appendChild(indicators);
    container.appendChild(inner);
    container.appendChild(createControlButton(carouselId, "prev"));
    container.appendChild(createControlButton(carouselId, "next"));
  } catch (error) {
    renderError(container, "Unable to load the carousel.");
    console.error("carousel failed to hydrate", error);
  }
};

const initCarousels = () => {
  document.querySelectorAll(CAROUSEL_SELECTOR).forEach(hydrateCarousel);
};

const hydratePhotoGrid = async (container) => {
  const manifestPath = (container.dataset.photoGridManifest || DEFAULT_PHOTO_GRID_MANIFEST).trim();
  if (!manifestPath) {
    renderError(container, "Photo grid manifest path missing.");
    return;
  }

  try {
    const { items, baseUrl } = await fetchManifest(manifestPath, "photo grid");
    container.textContent = "";

    items.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") {
        console.warn("photo-grid: skipping invalid manifest entry", entry);
        return;
      }
      const filename = String(entry.filename || "").trim();
      if (!filename) {
        console.warn("photo-grid: skipping entry without filename", entry);
        return;
      }

      const card = document.createElement("div");
      card.className = "photo-card";

      const image = document.createElement("img");
      image.loading = "lazy";
      image.src = new URL(filename, baseUrl).toString();
      image.alt = String(entry.alt || "").trim();
      image.addEventListener("error", () => {
        console.warn("photo-grid: failed to load", image.src);
      });
      card.appendChild(image);

      const metadata = entry.metadata;
      if (metadata && typeof metadata === "object") {
        card.dataset.metadata = JSON.stringify(metadata);
      }

      container.appendChild(card);
    });
  } catch (error) {
    renderError(container, "Unable to load the photo grid.");
    console.error("photo grid failed to hydrate", error);
  }
};

const initPhotoGrids = () => {
  document.querySelectorAll(PHOTO_GRID_SELECTOR).forEach(hydratePhotoGrid);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initCarousels();
    initPhotoGrids();
  });
} else {
  initCarousels();
  initPhotoGrids();
}
