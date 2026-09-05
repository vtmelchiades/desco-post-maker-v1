const dataUrlCache = new Map<string, Promise<string>>();

export const GOOGLE_FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap";

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** Fetches any URL and returns a base64 data URL (memoized). Data URLs pass through. */
export function toDataURL(url: string): Promise<string> {
  if (url.startsWith("data:")) return Promise.resolve(url);
  const hit = dataUrlCache.get(url);
  if (hit) return hit;
  const p = fetch(url, { mode: "cors", cache: "force-cache" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
      return r.blob();
    })
    .then(blobToDataURL)
    .catch((err) => {
      dataUrlCache.delete(url);
      throw err;
    });
  dataUrlCache.set(url, p);
  return p;
}

let fontCssPromise: Promise<string> | null = null;

/**
 * Builds a self-contained @font-face CSS block (woff2 as base64) so that the
 * SVG can be rasterized inside an <img> with the exact brand typefaces.
 */
export function embeddedFontCss(): Promise<string> {
  if (fontCssPromise) return fontCssPromise;
  fontCssPromise = (async () => {
    try {
      const css = await fetch(GOOGLE_FONTS_CSS, { mode: "cors" }).then((r) => r.text());
      const blocks = css.match(/@font-face\s*{[^}]*}/g) ?? [];
      const latin = blocks.filter((b) => {
        const m = b.match(/unicode-range:\s*([^;]+);/);
        if (!m) return true;
        return /U\+0000-00FF/i.test(m[1]);
      });
      const out: string[] = [];
      for (const b of latin) {
        const urlMatch = b.match(/url\(([^)]+)\)/);
        if (!urlMatch) continue;
        const fontUrl = urlMatch[1].replace(/["']/g, "");
        try {
          const data = await toDataURL(fontUrl);
          out.push(b.replace(urlMatch[0], `url(${data})`).replace(/unicode-range:[^;]+;/, ""));
        } catch {
          out.push(b);
        }
      }
      return out.join("\n");
    } catch (err) {
      console.warn("Font embedding failed, falling back to system fonts", err);
      return "";
    }
  })();
  return fontCssPromise;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return blobToDataURL(file);
}

/** Downscale an uploaded image to keep SVG payloads manageable. */
export async function normalizeUpload(file: File, maxSide = 2200): Promise<string> {
  const raw = await readFileAsDataURL(file);
  const img = await loadImage(raw);
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && file.size < 2_500_000) return raw;
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * scale);
  c.height = Math.round(img.naturalHeight * scale);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.9);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}
