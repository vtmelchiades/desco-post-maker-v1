import { saveAs } from "file-saver";
import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import { FORMATS } from "../data/brand";
import type { Format, Post } from "../data/types";
import { embeddedFontCss, loadImage } from "./assets";
import { resolveExportBackground, type ExportSettings } from "./exporter";
import { ShaderRenderer } from "./shaders";
import { renderBackgroundSVG, renderPostSVG, slideCount } from "./svg";

/* ─────────────────────────────── capability ─────────────────────────────── */

/** WebCodecs is what turns rendered frames into a real H.264 .mp4 in the browser. */
export const VIDEO_SUPPORTED =
  typeof window !== "undefined" &&
  typeof window.VideoEncoder === "function" &&
  typeof window.VideoFrame === "function";

/**
 * True when the post's background is the live WebGL shader rather than a baked
 * still. Mirrors the preview rule: `minimal` and `split` paint an opaque plate
 * of their own, so a moving shader underneath would never show through.
 */
export function liveShaderFor(post: Post, override?: string) {
  return (
    !override &&
    post.background.type === "shader" &&
    post.archetype !== "minimal" &&
    post.archetype !== "split"
  );
}

/** Whether a post has anything that actually moves — i.e. whether MP4 is worth offering. */
export function hasMotion(post: Post, override?: string) {
  return post.archetype === "kinetic" || liveShaderFor(post, override);
}

/* ──────────────────────────────── options ───────────────────────────────── */

export const VIDEO_DURATIONS = [5, 10, 15] as const;
export type VideoDuration = (typeof VIDEO_DURATIONS)[number];

export interface VideoProgress {
  label: string;
  done: number;
  total: number;
}

export interface VideoOptions {
  duration?: number;
  fps?: number;
  onProgress?: (p: VideoProgress) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Shader clock offset, matching the still exports and the preview's start time. */
const SHADER_T0 = 4.2;

/* ─────────────────────────────── rasterizing ────────────────────────────── */

/** Rasterizes an SVG string onto a 2D context. Blob URL is released either way. */
async function drawSVG(svg: string, ctx: CanvasRenderingContext2D, w: number, h: number) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = await loadImage(url);
    ctx.drawImage(img, 0, 0, w, h);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ──────────────────────────────── encoding ──────────────────────────────── */

/**
 * Picks the first H.264 profile/level this browser will actually encode at this
 * resolution — story frames (1050×1920) exceed what the lower levels allow.
 */
async function pickCodec(w: number, h: number, fps: number): Promise<VideoEncoderConfig | null> {
  const bitrate = Math.min(12_000_000, Math.round(w * h * fps * 0.12));
  const candidates = ["avc1.640034", "avc1.640028", "avc1.4d0034", "avc1.4d0028", "avc1.42e034"];
  for (const codec of candidates) {
    const config: VideoEncoderConfig = { codec, width: w, height: h, bitrate, framerate: fps };
    try {
      const support = await VideoEncoder.isConfigSupported(config);
      if (support.supported) return config;
    } catch {
      // unsupported string — try the next profile
    }
  }
  return null;
}

/* ─────────────────────────────── public API ─────────────────────────────── */

/**
 * Captures a post's looping animation as an H.264 .mp4.
 *
 * The SVG renderer drives its motion with CSS keyframes, which cannot be seeked
 * from script, so each frame is re-rendered with `timeSec` baking the loop state
 * into plain transforms. Background and foreground are composited separately:
 * the WebGL shader (or the treated still) is painted first, then the foreground
 * SVG — rendered transparent where the background belongs — goes on top.
 */
export async function exportPostVideo(
  post: Post,
  format: Format,
  slide: number,
  settings: ExportSettings,
  opts: VideoOptions = {}
) {
  if (!VIDEO_SUPPORTED) {
    throw new Error(
      "Este navegador não suporta exportação de vídeo (WebCodecs). Use Chrome, Edge, Safari 16.4+ ou Firefox 130+."
    );
  }

  const fps = opts.fps ?? 30;
  const duration = opts.duration ?? 15;
  const { w, h } = FORMATS[format];
  const totalFrames = Math.max(1, Math.round(duration * fps));
  const total = totalFrames + 1;
  const report = (label: string, done: number) => opts.onProgress?.({ label, done, total });

  report("Preparando…", 0);

  const config = await pickCodec(w, h, fps);
  if (!config) throw new Error("Nenhum perfil H.264 disponível neste navegador para este formato.");

  // Fonts must travel inside each frame: an SVG rasterized through <img> is its
  // own document and cannot reach the page's webfonts.
  const fontCss = await embeddedFontCss();

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas 2D indisponível.");

  const override = settings.overrides[post.id];
  const bg = post.background;

  // Background layer: animated shader when the post uses one, otherwise a still
  // rasterized once (the treated photo, an upload, or a shader snapshot).
  let renderer: ShaderRenderer | null = null;
  let glCanvas: HTMLCanvasElement | null = null;
  let stillBg: HTMLCanvasElement | null = null;

  if (liveShaderFor(post, override) && bg.type === "shader") {
    glCanvas = document.createElement("canvas");
    glCanvas.width = w;
    glCanvas.height = h;
    const r = new ShaderRenderer(glCanvas);
    if (r.available) renderer = r;
    else r.dispose();
  }

  if (!renderer) {
    const href = await resolveExportBackground(post, format, slide, settings);
    stillBg = document.createElement("canvas");
    stillBg.width = w;
    stillBg.height = h;
    const bgCtx = stillBg.getContext("2d");
    if (!bgCtx) throw new Error("Canvas 2D indisponível.");
    await drawSVG(renderBackgroundSVG(post, format, href), bgCtx, w, h);
  }

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width: w, height: h, frameRate: fps },
    fastStart: "in-memory",
  });

  let encodeError: Error | null = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (err) => {
      encodeError = err instanceof Error ? err : new Error(String(err));
    },
  });
  encoder.configure(config);

  const frameDuration = 1_000_000 / fps;

  try {
    for (let i = 0; i < totalFrames; i++) {
      if (encodeError) throw encodeError;
      const t = i / fps;

      if (renderer && glCanvas && bg.type === "shader") {
        renderer.render(bg.shader, w, h, SHADER_T0 + t, bg.seed, slide, slideCount(post));
        ctx.drawImage(glCanvas, 0, 0, w, h);
      } else if (stillBg) {
        ctx.drawImage(stillBg, 0, 0, w, h);
      }

      // `bgHref: null` leaves the background transparent so the layer painted
      // above shows through; `timeSec` freezes the loop at this exact frame.
      const svg = renderPostSVG(post, {
        format,
        slide,
        bgHref: null,
        timeSec: t,
        fontCss,
        forExport: true,
      });
      await drawSVG(svg, ctx, w, h);

      const frame = new VideoFrame(canvas, {
        timestamp: Math.round(i * frameDuration),
        duration: Math.round(frameDuration),
      });
      encoder.encode(frame, { keyFrame: i % (fps * 2) === 0 });
      frame.close();

      // Keep the encoder queue shallow so memory stays flat on long exports.
      while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 4));

      report(`Frame ${i + 1}/${totalFrames}`, i + 1);
    }

    report("Finalizando MP4…", totalFrames);
    await encoder.flush();
    if (encodeError) throw encodeError;
    muxer.finalize();
  } finally {
    if (encoder.state !== "closed") encoder.close();
    renderer?.dispose(true);
  }

  const base = slideCount(post) > 1 ? `slide_${pad2(slide + 1)}_${FORMATS[format].file}` : FORMATS[format].file;
  saveAs(
    new Blob([muxer.target.buffer], { type: "video/mp4" }),
    `desco_${pad2(post.id)}_${base}_${duration}s.mp4`
  );
  report("Concluído", total);
}
