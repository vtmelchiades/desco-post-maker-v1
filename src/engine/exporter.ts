import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FORMATS, photoUrl, pillarById, PILLARS } from "../data/brand";
import type { Format, Post } from "../data/types";
import { embeddedFontCss, loadImage, toDataURL } from "./assets";
import { shaderSnapshot } from "./shaders";
import { renderPostSVG, slideCount } from "./svg";

export type Overrides = Record<number, string>;

export interface ExportProgress {
  label: string;
  done: number;
  total: number;
}

export interface ExportSettings {
  scale: 1 | 2 | 3;
  overrides: Overrides;
  onProgress?: (p: ExportProgress) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export const folderNameFor = (post: Post) => `${pad2(post.id)}_${post.slug}`;
export const pillarFolderFor = (post: Post) => {
  const p = pillarById(post.pillar);
  return `${p.code}_${p.id}`;
};

/** Resolve the background href to embed in an export-grade SVG. */
export async function resolveExportBackground(
  post: Post,
  format: Format,
  slide: number,
  settings: ExportSettings
): Promise<string> {
  const override = settings.overrides[post.id];
  if (override) return override;
  const bg = post.background;
  const { w, h } = FORMATS[format];
  if (bg.type === "photo") {
    const width = post.archetype === "carousel" ? 2200 : 1600;
    try {
      return await toDataURL(photoUrl(bg.id, width));
    } catch (err) {
      console.warn("Photo embed failed, using shader fallback", err);
      return shaderSnapshot("mesh", w, h, bg.id % 97);
    }
  }
  const sc = Math.min(settings.scale, 2);
  return shaderSnapshot(bg.shader, w * sc, h * sc, bg.seed, slide, slideCount(post));
}

export async function buildExportSVG(
  post: Post,
  format: Format,
  slide: number,
  settings: ExportSettings
): Promise<string> {
  const [bgHref, fontCss] = await Promise.all([
    resolveExportBackground(post, format, slide, settings),
    embeddedFontCss(),
  ]);
  return renderPostSVG(post, { format, slide, bgHref, animate: false, fontCss, forExport: true });
}

export async function svgToPngBlob(svg: string, w: number, h: number, scale: number): Promise<Blob> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!png) throw new Error("PNG encoding failed");
    return png;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fileBase(post: Post, format: Format, slide: number) {
  const base = FORMATS[format].file;
  return slideCount(post) > 1 ? `slide_${pad2(slide + 1)}_${base}` : base;
}

export function captionFile(post: Post) {
  const pillar = pillarById(post.pillar);
  return `DESCO — POST ${pad2(post.id)} / 50
Pilar: ${pillar.code} · ${pillar.label}
Arquétipo: ${post.archetype}
Formatos: Feed 1050×1350 · Story 1050×1920${slideCount(post) > 1 ? ` · Carrossel ${slideCount(post)} lâminas` : ""}
${"─".repeat(60)}

${post.caption}
`;
}

export function promptFile(post: Post) {
  const bg = post.background;
  const src =
    bg.type === "photo"
      ? `Reference photo: Pexels #${bg.id} (${bg.credit}) — treatment: ${bg.treatment}`
      : `Procedural background: WebGL shader "${bg.shader}" seed ${bg.seed} (no photo reference)`;
  return `IMAGE PROMPT — Desco post ${pad2(post.id)} (${post.slug})
Target models: Midjourney v6 / Flux.1 [dev]
Aspect: 4:5 (feed) — reframe to 9:16 for story with --ar 9:16
${src}
${"─".repeat(60)}

${post.imagePrompt}

Negative / avoid: text, watermark, logo, stock-photo smile, HDR halos, oversaturated colors, blue-orange teal grade, clutter.
Color calibration: near-black #080808 shadows, warm off-white #ecece6 highlights, single acid-green #d4ff00 accent, low saturation elsewhere.
Flux.1 settings: guidance 3.5, steps 28–40, sampler euler, resolution 1050×1350 (or 1050×1920), seed locked for series consistency.
`;
}

async function addPostToFolder(folder: JSZip, post: Post, settings: ExportSettings, tick: (label: string) => void) {
  const formats: Format[] = ["feed", "story"];
  const n = slideCount(post);
  for (const fmt of formats) {
    const dir = folder.folder(fmt)!;
    const { w, h } = FORMATS[fmt];
    for (let s = 0; s < n; s++) {
      tick(`Post ${pad2(post.id)} · ${fmt}${n > 1 ? ` · lâmina ${s + 1}/${n}` : ""}`);
      const svg = await buildExportSVG(post, fmt, s, settings);
      const base = fileBase(post, fmt, s);
      dir.file(`${base}.svg`, svg);
      try {
        const png = await svgToPngBlob(svg, w, h, settings.scale);
        dir.file(`${base}.png`, png);
      } catch (err) {
        console.warn("PNG rasterization failed", err);
      }
    }
  }
  folder.file("legenda.txt", captionFile(post));
  folder.file("image_prompt.txt", promptFile(post));
}

function makeProgress(total: number, settings: ExportSettings) {
  let done = 0;
  return {
    tick: (label: string) => {
      done += 1;
      settings.onProgress?.({ label, done, total });
    },
    finish: (label: string) => settings.onProgress?.({ label, done: total, total }),
  };
}

const unitsFor = (posts: Post[]) => posts.reduce((acc, p) => acc + slideCount(p) * 2, 0);

export async function exportPostZip(post: Post, settings: ExportSettings) {
  const zip = new JSZip();
  const folder = zip.folder(folderNameFor(post))!;
  const prog = makeProgress(unitsFor([post]) + 1, settings);
  await addPostToFolder(folder, post, settings, prog.tick);
  prog.tick("Compactando…");
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  saveAs(blob, `desco_post_${pad2(post.id)}_${post.slug}.zip`);
  prog.finish("Concluído");
}

export async function exportPillarZip(pillarId: string, posts: Post[], settings: ExportSettings) {
  const pillar = pillarById(pillarId);
  const list = posts.filter((p) => p.pillar === pillarId);
  const zip = new JSZip();
  const root = zip.folder(`${pillar.code}_${pillar.id}`)!;
  const prog = makeProgress(unitsFor(list) + 1, settings);
  for (const post of list) {
    await addPostToFolder(root.folder(folderNameFor(post))!, post, settings, prog.tick);
  }
  root.file("README.txt", `DESCO — Pilar ${pillar.code} · ${pillar.label}\n${pillar.description}\n\n${list.length} posts · gerado por Desco Post Engine`);
  prog.tick("Compactando…");
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  saveAs(blob, `desco_pilar_${pillar.code}_${pillar.id}.zip`);
  prog.finish("Concluído");
}

export async function exportMasterZip(posts: Post[], settings: ExportSettings) {
  const zip = new JSZip();
  const prog = makeProgress(unitsFor(posts) + 1, settings);
  for (const pillar of PILLARS) {
    const list = posts.filter((p) => p.pillar === pillar.id);
    if (!list.length) continue;
    const root = zip.folder(`${pillar.code}_${pillar.id}`)!;
    for (const post of list) {
      await addPostToFolder(root.folder(folderNameFor(post))!, post, settings, prog.tick);
    }
  }
  zip.file(
    "README.txt",
    `DESCO — MASTER PACK · 50 POSTS\nLaboratório de estratégia, design e ruptura visual — Bauru/SP\n\nEstrutura:\n  /{pilar}/{post}/feed/post_feed_1050x1350.png|svg\n  /{pilar}/{post}/story/post_story_1050x1920.png|svg\n  /{pilar}/{post}/legenda.txt\n  /{pilar}/{post}/image_prompt.txt\n\nSVGs preservam texto e vetores editáveis no Adobe Illustrator; fundos fotográficos/shader estão embutidos como raster.\nEscala PNG: ${settings.scale}x`
  );
  prog.tick("Compactando…");
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  saveAs(blob, `desco_master_50_posts.zip`);
  prog.finish("Concluído");
}

export async function downloadSVG(post: Post, format: Format, slide: number, settings: ExportSettings) {
  const svg = await buildExportSVG(post, format, slide, settings);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, `desco_${pad2(post.id)}_${fileBase(post, format, slide)}.svg`);
}

export async function downloadPNG(post: Post, format: Format, slide: number, settings: ExportSettings) {
  const { w, h } = FORMATS[format];
  const svg = await buildExportSVG(post, format, slide, settings);
  const png = await svgToPngBlob(svg, w, h, settings.scale);
  saveAs(png, `desco_${pad2(post.id)}_${fileBase(post, format, slide)}@${settings.scale}x.png`);
}

export function downloadText(name: string, content: string) {
  saveAs(new Blob([content], { type: "text/plain;charset=utf-8" }), name);
}
